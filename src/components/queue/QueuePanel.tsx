'use client';

import { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { usePlayerStore } from '@/store/playerStore';
import { useQueueStore } from '@/store/queueStore';
import { QueueItem } from '@/components/queue/QueueItem';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export function QueuePanel() {
  const uiStore = useUIStore();
  const playerStore = usePlayerStore();
  const queueStore = useQueueStore();

  const [activeTab, setActiveTab] = useState<'queue' | 'recently-played'>('queue');

  const currentTrack = playerStore.currentTrack;
  const manualQueue = queueStore.manualQueue;
  const autoQueue = queueStore.autoQueue;
  const autoQueueSource = queueStore.autoQueueSource;
  const history = queueStore.history;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: { active: { id: string | number }; over: { id: string | number } | null }) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = manualQueue.findIndex((t) => t.id === String(active.id));
      const newIndex = manualQueue.findIndex((t) => t.id === String(over.id));

      if (oldIndex !== -1 && newIndex !== -1) {
        queueStore.reorderManualQueue(oldIndex, newIndex);
      }
    }
  };

  const handleRemoveFromQueue = (index: number) => {
    queueStore.removeFromManualQueue(index);
    toast.success('Removed from queue');
  };

  const closePanel = () => {
    uiStore.setRightPanel(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#121212]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#282828]">
        <h2 className="text-xl font-bold text-white">Queue</h2>
        <button
          onClick={closePanel}
          className="p-2 text-[#A7A7A7] hover:text-white transition-colors"
          aria-label="Close queue"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
            <path d="M3.465 1.586a.5.5 0 0 0-.707.708L4.414 4 2.758 5.656a.5.5 0 1 0 .707.708L5.12 4.707l1.656 1.656a.5.5 0 1 0 .708-.707L5.828 4l1.656-1.656a.5.5 0 0 0-.707-.708L5.12 3.293 3.465 1.586zM2 9.5A.5.5 0 0 1 2.5 9h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 9.5z" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex px-4 border-b border-[#282828]">
        <button
          onClick={() => setActiveTab('queue')}
          className={cn(
            'py-3 text-base font-medium border-b-2 transition-colors',
            activeTab === 'queue'
              ? 'text-white border-white'
              : 'text-[#A7A7A7] border-transparent hover:text-white'
          )}
        >
          Queue
        </button>
        <button
          onClick={() => setActiveTab('recently-played')}
          className={cn(
            'py-3 text-base font-medium border-b-2 ml-8 transition-colors',
            activeTab === 'recently-played'
              ? 'text-white border-white'
              : 'text-[#A7A7A7] border-transparent hover:text-white'
          )}
        >
          Recently played
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-3">
        {activeTab === 'queue' ? (
          <>
            {/* Now Playing Section */}
            {currentTrack && (
              <div className="mb-4">
                <h3 className="px-4 text-xs font-medium uppercase tracking-wider text-[#A7A7A7] mb-1">
                  Now playing
                </h3>
                <QueueItem track={currentTrack} isCurrentTrack />
              </div>
            )}

            {/* Next in Queue Section */}
            {manualQueue.length > 0 && (
              <div className="mb-4">
                <h3 className="px-4 text-xs font-medium uppercase tracking-wider text-[#A7A7A7] mb-1">
                  Next in queue
                </h3>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={manualQueue.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {manualQueue.map((track, index) => (
                      <QueueItem
                        key={track.id}
                        track={track}
                        isDraggable
                        onRemove={() => handleRemoveFromQueue(index)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {/* Next From Section */}
            {autoQueue.length > 0 && (
              <div>
                <h3 className="px-4 text-xs font-medium uppercase tracking-wider text-[#A7A7A7] mb-1">
                  Next from:{' '}
                  <span className="normal-case text-white">
                    {autoQueueSource || 'Playlist'}
                  </span>
                </h3>
                {autoQueue.slice(0, 10).map((track) => (
                  <QueueItem key={track.id} track={track} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!currentTrack && manualQueue.length === 0 && autoQueue.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-12 h-12 text-[#A7A7A7] mb-3">
                  <path fillRule="evenodd" d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" />
                </svg>
                <p className="text-sm text-[#A7A7A7]">Your queue is empty</p>
                <p className="text-xs text-[#A7A7A7] mt-1">Add songs to play next</p>
              </div>
            )}
          </>
        ) : (
          /* Recently Played Tab */
          <>
            {history.length > 0 ? (
              <div>
                <h3 className="px-4 text-xs font-medium uppercase tracking-wider text-[#A7A7A7] mb-1">
                  Recently played
                </h3>
                {history.map((track) => (
                  <QueueItem key={track.id} track={track} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-12 h-12 text-[#A7A7A7] mb-3">
                  <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
                  <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z" />
                </svg>
                <p className="text-sm text-[#A7A7A7]">No recently played tracks</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
