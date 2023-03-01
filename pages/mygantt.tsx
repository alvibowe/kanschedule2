import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

import AppLayout from "@lib/components/Layouts/AppLayout";

const Page = () => {
    const tasks: Task[] = [
        {
          start: new Date(2020, 1, 1),
          end: new Date(2020, 1, 2),
          name: 'Idea',
          id: 'Task 0',
          type:'task',
          progress: 45,
          isDisabled: true,
          styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
        },
    ]

    return (
        <>
            <AppLayout>
                <Gantt tasks={tasks} />
            </AppLayout>
        </>
    )
}

export default Page;