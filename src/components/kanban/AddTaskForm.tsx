import { useState } from 'react';
import { Plus } from 'lucide-react';
import CreateTaskModal from './CreateTaskModal';

interface AddTaskFormProps {
    onAdd: (taskData: any) => Promise<void> | void;
}

const AddTaskForm = ({ onAdd }: AddTaskFormProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 w-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg bg-transparent hover:bg-zinc-100 dark:hover:bg-white/[0.04] text-zinc-500 dark:text-zinc-400 text-[13px] font-medium px-3.5 py-2.5 text-left"
                aria-label="Add a new task"
            >
                <Plus size={14} aria-hidden="true" />
                Add a task
            </button>
            <CreateTaskModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={async (taskData) => {
                    await onAdd(taskData);
                    setIsModalOpen(false);
                }}
            />
        </>
    );
};

export default AddTaskForm;