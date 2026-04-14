import { useState } from 'react'
import { format } from 'date-fns'
import { CheckCircle2, Circle, Plus, Trash2, Star, StarOff, Edit2 } from 'lucide-react'
import { TodoTask } from '../types'

interface TodoListProps {
  todos: TodoTask[]
  setTodos: (todos: TodoTask[] | ((prev: TodoTask[]) => TodoTask[])) => void
}

/** Newest created first (used for tasks with no due date). */
const sortByCreatedAtDesc = (a: TodoTask, b: TodoTask) => {
  const ta = new Date(a.createdAt).getTime()
  const tb = new Date(b.createdAt).getTime()
  const safeA = Number.isNaN(ta) ? 0 : ta
  const safeB = Number.isNaN(tb) ? 0 : tb
  return safeB - safeA
}

/** Soonest due first; optional time refines ordering. Tasks without a due date sort last (newest created first among those). */
const getDueTimestamp = (task: TodoTask): number | null => {
  if (!task.dueDate) return null
  const timePart = task.dueTime && task.dueTime.length > 0 ? task.dueTime : '00:00:00'
  const ms = new Date(`${task.dueDate}T${timePart}`).getTime()
  return Number.isNaN(ms) ? null : ms
}

const sortByDueDateAsc = (a: TodoTask, b: TodoTask) => {
  const da = getDueTimestamp(a)
  const db = getDueTimestamp(b)
  if (da != null && db != null) return da - db
  if (da != null && db === null) return -1
  if (da === null && db != null) return 1
  return sortByCreatedAtDesc(a, b)
}

const TodoList = ({ todos, setTodos }: TodoListProps) => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskImportance, setNewTaskImportance] = useState<'low' | 'medium' | 'high'>('medium')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [newTaskDueTime, setNewTaskDueTime] = useState('')

  const activeTasks = todos.filter(t => !t.completed)
  const highPriorityTasks = activeTasks.filter(t => t.importance === 'high').sort(sortByDueDateAsc)
  const mediumPriorityTasks = activeTasks.filter(t => t.importance === 'medium').sort(sortByDueDateAsc)
  const lowPriorityTasks = activeTasks.filter(t => t.importance === 'low').sort(sortByDueDateAsc)

  const completedTasks = todos.filter(t => t.completed).sort((a, b) => {
    const dateA = new Date(a.completedAt || a.createdAt).getTime()
    const dateB = new Date(b.completedAt || b.createdAt).getTime()
    return dateB - dateA
  })

  const resetTaskForm = () => {
    setNewTaskTitle('')
    setNewTaskDescription('')
    setNewTaskImportance('medium')
    setNewTaskDueDate('')
    setNewTaskDueTime('')
    setEditingTaskId(null)
  }

  const handleOpenAddModal = () => {
    resetTaskForm()
    setShowAddModal(true)
  }

  const handleOpenEditModal = (task: TodoTask) => {
    setEditingTaskId(task.id)
    setNewTaskTitle(task.title)
    setNewTaskDescription(task.description || '')
    setNewTaskImportance(task.importance)
    setNewTaskDueDate(task.dueDate || '')
    setNewTaskDueTime(task.dueTime || '')
    setShowAddModal(true)
  }

  const handleSaveTask = () => {
    if (!newTaskTitle.trim()) return
    if (editingTaskId) {
      setTodos(prev =>
        prev.map(task =>
          task.id === editingTaskId
            ? {
                ...task,
                title: newTaskTitle.trim(),
                description: newTaskDescription.trim() || undefined,
                importance: newTaskImportance,
                dueDate: newTaskDueDate || undefined,
                dueTime: newTaskDueTime || undefined,
              }
            : task
        )
      )
    } else {
      const newTask: TodoTask = {
        id: crypto.randomUUID(),
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
        importance: newTaskImportance,
        dueDate: newTaskDueDate || undefined,
        dueTime: newTaskDueTime || undefined,
        completed: false,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
      }
      setTodos(prev => [...prev, newTask])
    }
    setShowAddModal(false)
    resetTaskForm()
  }

  const handleToggleComplete = (id: string) => {
    setTodos(prev => prev.map(t => 
      t.id === id 
        ? { 
            ...t, 
            completed: !t.completed,
            completedAt: !t.completed ? format(new Date(), 'yyyy-MM-dd') : undefined
          }
        : t
    ))
  }

  const handleDelete = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const getImportanceColor = (importance: 'low' | 'medium' | 'high') => {
    switch (importance) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
    }
  }

  const getImportanceIcon = (importance: 'low' | 'medium' | 'high') => {
    switch (importance) {
      case 'high':
        return <Star className="fill-current" size={16} />
      case 'medium':
        return <Star className="fill-current opacity-60" size={16} />
      case 'low':
        return <StarOff size={16} />
    }
  }

  const renderTaskCard = (task: TodoTask) => (
    <div
      key={task.id}
      className="p-4 bg-white dark:bg-gray-700 rounded-xl border-l-4 border-primary-400 dark:border-primary-500 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => handleToggleComplete(task.id)}
          className="mt-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <Circle size={24} />
        </button>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{task.title}</h4>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getImportanceColor(task.importance)}`}>
                {getImportanceIcon(task.importance)}
                {task.importance}
              </span>
              <button
                onClick={() => handleOpenEditModal(task)}
                className="p-1 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
                title="Edit task"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{task.description}</p>
          )}
          {(task.dueDate || task.dueTime) && (
            <p className="text-xs text-primary-700 dark:text-primary-300 mt-2">
              Due {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'date TBD'}
              {task.dueTime ? ` at ${task.dueTime}` : ''}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page-shell animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            To-Do List
          </h2>
          <p className="text-gray-600 dark:text-gray-300">Organize your tasks and track your progress</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Active Tasks */}
      <div className="glass-effect rounded-2xl p-6 card-hover">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Active Tasks ({activeTasks.length})
        </h3>
        {activeTasks.length > 0 ? (
          <div className="space-y-5">
            {highPriorityTasks.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-red-700 dark:text-red-400">High Priority</h4>
                <div className="space-y-3">
                  {highPriorityTasks.map(renderTaskCard)}
                </div>
              </div>
            )}
            {mediumPriorityTasks.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-yellow-700 dark:text-yellow-400">Medium Priority</h4>
                <div className="space-y-3">
                  {mediumPriorityTasks.map(renderTaskCard)}
                </div>
              </div>
            )}
            {lowPriorityTasks.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-green-700 dark:text-green-400">Low Priority</h4>
                <div className="space-y-3">
                  {lowPriorityTasks.map(renderTaskCard)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-300 italic text-center py-8">
            No active tasks. Add one to get started.
          </p>
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="glass-effect rounded-2xl p-6 card-hover">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Completed ({completedTasks.length})
          </h3>
          <div className="space-y-3">
            {completedTasks.map(task => (
              <div
                key={task.id}
                className="p-4 bg-white dark:bg-gray-700 rounded-xl border-l-4 border-green-400 dark:border-green-500 opacity-75"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className="mt-1 text-green-600 dark:text-green-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <CheckCircle2 size={24} />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-gray-600 dark:text-gray-400 line-through">{task.title}</h4>
                      <button
                        onClick={() => handleOpenEditModal(task)}
                        className="p-1 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
                        title="Edit task"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 line-through">{task.description}</p>
                    )}
                    {(task.dueDate || task.dueTime) && (
                      <p className="text-xs text-primary-700/80 dark:text-primary-300/80 mt-2">
                        Due {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'date TBD'}
                        {task.dueTime ? ` at ${task.dueTime}` : ''}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Completed {task.completedAt && format(new Date(task.completedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full animate-scale-in shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              {editingTaskId ? 'Edit Task' : 'Add New Task'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Add more details..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Importance
                </label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setNewTaskImportance(level)}
                      className={`flex-1 px-4 py-3 rounded-xl transition-all ${
                        newTaskImportance === level
                          ? `${getImportanceColor(level)} scale-105 ring-2 ring-primary-200 dark:ring-primary-800`
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {getImportanceIcon(level)}
                        <span className="capitalize font-medium">{level}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date (optional)
                  </label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Time (optional)
                  </label>
                  <input
                    type="time"
                    value={newTaskDueTime}
                    onChange={(e) => setNewTaskDueTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  resetTaskForm()
                }}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTask}
                disabled={!newTaskTitle.trim()}
                className="flex-1 px-4 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingTaskId ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoList

