import { ref, computed } from 'vue'
import Swal from 'sweetalert2'

export function useCalendar() {
  const calendar = ref(null)
  const focus = ref(new Date())
  const type = ref('month')
  const dialog = ref(false)
  const isEditing = ref(false)
  const selectedIndex = ref(null)

  const dragEvent = ref(null)
  const dragTime = ref(null)
  const createEvent = ref(null)
  const createStart = ref(null)

  const searchQuery = ref(null)

  const users = ref([
    { id: 1, name: 'Khun A', color: '#5C6BC0' }, 
    { id: 2, name: 'Khun B', color: '#F06292' }, 
    { id: 3, name: 'Khun C', color: '#4DB6AC' }  
  ])

  const newEvent = ref({
    title: '', start: '', end: '', color: '#5C6BC0', details: '', userId: null
  })

  const events = ref([
    { name: 'Weekly Sync', start: new Date('2026-02-27T09:00:00').getTime(), end: new Date('2026-02-27T10:30:00').getTime(), color: '#5C6BC0', timed: true, userId: 1 },
  ])

  const typeToLabel = { month: 'Month', week: 'Week', day: 'Day' }

  const toTime = (tms) => new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
  
  const roundTime = (time, down = true) => {
    const roundDownTime = 15 * 60 * 1000
    return down ? time - time % roundDownTime : time + (roundDownTime - (time % roundDownTime))
  }

  const setDuration = (minutes) => {
    if (!newEvent.value.start) return
    const startTime = new Date(newEvent.value.start).getTime()
    const endTime = startTime + (minutes * 60 * 1000)
    newEvent.value.end = new Date(endTime).toISOString().split('T')[0] 
  }

  const startDrag = ({ event, timed }) => { if (event && timed) dragEvent.value = event }
  
  const startTime = (tms) => {
    const mouse = toTime(tms)
    if (dragEvent.value) {
      dragTime.value = mouse - dragEvent.value.start
    } else {
      createStart.value = roundTime(mouse)
      createEvent.value = { 
        name: 'New Activity', 
        color: '#5C6BC0', 
        start: createStart.value, 
        end: createStart.value + 3600000, 
        timed: true, 
        userId: selectedUserId.value 
      }
      events.value.push(createEvent.value)
    }
  }

  const mouseMove = (tms) => {
    const mouse = toTime(tms)
    if (dragEvent.value && dragTime.value !== null) {
      const duration = dragEvent.value.end - dragEvent.value.start
      dragEvent.value.start = roundTime(mouse - dragTime.value)
      dragEvent.value.end = dragEvent.value.start + duration
    } else if (createEvent.value) {
      createEvent.value.end = Math.max(roundTime(mouse, false), createStart.value + 900000)
    }
  }

  const endDrag = () => { 
    dragEvent.value = null; dragTime.value = null; createEvent.value = null; createStart.value = null;
  }

  const extendBottom = (event) => {
    createEvent.value = event
    createStart.value = event.start
  }

  const selectedUserId = ref(null)
  const filteredEvents = computed(() => {
    let list = selectedUserId.value ? events.value.filter(e => e.userId === selectedUserId.value) : events.value
    return list.map(e => ({ ...e, start: new Date(e.start), end: new Date(e.end) }))
  })

  const searchedEvents = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return events.value.filter(event => 
    event.name.toLowerCase().includes(query) || 
    (event.details && event.details.toLowerCase().includes(query))
  )
})

  const openDialogForAdd = () => {
    isEditing.value = false
    newEvent.value = { 
      title: '', 
      start: new Date().toISOString().split('T')[0], 
      end: new Date().toISOString().split('T')[0], 
      color: '#5C6BC0', 
      details: '', 
      userId: selectedUserId.value 
    }
    dialog.value = true
  }

  const openDialogForEdit = ({ event }) => {
    isEditing.value = true
    selectedIndex.value = events.value.findIndex(e => e === event)
    newEvent.value = { 
      title: event.name, 
      start: new Date(event.start).toISOString().split('T')[0], 
      end: new Date(event.end).toISOString().split('T')[0], 
      color: event.color, 
      details: event.details || '', 
      userId: event.userId 
    }
    dialog.value = true
  }

  const saveEvent = () => {
    const data = { 
      ...newEvent.value, 
      name: newEvent.value.title, 
      start: new Date(newEvent.value.start).getTime(), 
      end: new Date(newEvent.value.end).getTime(), 
      timed: true 
    }
    if (isEditing.value) events.value[selectedIndex.value] = data
    else events.value.push(data)
    dialog.value = false
    Swal.fire({ icon: 'success', title: 'Saved', showConfirmButton: false, timer: 1000 })
  }

  const deleteEvent = () => {
    events.value.splice(selectedIndex.value, 1)
    dialog.value = false
  }

  return {
    calendar, focus, type, dialog, isEditing, events, newEvent, typeToLabel, users, selectedUserId, filteredEvents,
    startDrag, startTime, mouseMove, endDrag, extendBottom, openDialogForAdd, openDialogForEdit, saveEvent, deleteEvent, setDuration
  }
}