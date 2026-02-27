<template>
  <default-layout>
    <div class="planner-main-frame bg-grey-lighten-4">
      <v-row no-gutters class="h-100">
        
        <v-col cols="12" md="3" class="sidebar-section border-right">
          <div class="d-flex flex-column h-100 pa-6 bg-white shadow-sm">
            <div class="d-flex align-center mb-8 px-2">
              <v-icon color="indigo-darken-3" class="me-3" size="28">mdi-calendar-multiselect</v-icon>
              <h2 class="text-subtitle-1 font-weight-black text-indigo-darken-4" style="letter-spacing: 1.5px;">PLANNER</h2>
            </div>

            <div class="px-2 mb-8 flex-none">
              <v-btn 
                variant="flat" color="indigo-darken-2" prepend-icon="mdi-plus" size="small"
                class="rounded-lg text-none font-weight-bold shadow-sm" 
                height="38" min-width="120" @click="openDialogForAdd"
              >
                Add Activity
              </v-btn>

                                                                      
              
            </div>

            <!-- <div class="text-overline text-grey-darken-1 mb-3 ps-2 font-weight-black">MEMBERS</div> -->
             <v-list-item title="View All Plan" :active="selectedUserId === null" @click="selectedUserId = null" class="rounded-lg mb-1 member-item" active-color="indigo-darken-2">
                <!-- <template v-slot:prepend><v-icon size="18" color="indigo-lighten-2" class="me-3">mdi-circle-slice-8</v-icon></template> -->
              </v-list-item>
            <v-list density="compact" nav class="bg-transparent px-0 overflow-y-auto flex-grow-1 custom-scrollbar">
              
              <v-list-item v-for="user in users" :key="user.id" :title="user.name" :active="selectedUserId === user.id" @click="selectedUserId = user.id" class="rounded-lg mb-1 member-item" active-color="indigo-darken-2">
                <template v-slot:prepend><v-icon size="14" :color="user.color" class="me-3">mdi-circle</v-icon></template>
              </v-list-item>
            </v-list>
          </div>
        </v-col>

        <v-col cols="12" md="9" class="calendar-section d-flex flex-column overflow-hidden">
          
          <v-toolbar flat color="white" height="70" class="px-6 border-bottom flex-none">
             <div class="ms-6 d-flex bg-grey-lighten-4 rounded-lg overflow-hidden border">
              <v-btn icon variant="text" size="small" @click="calendar?.prev()"><v-icon size="20">mdi-chevron-left</v-icon></v-btn>
              <v-divider vertical></v-divider>
              <v-btn icon variant="text" size="small" @click="calendar?.next()"><v-icon size="20">mdi-chevron-right</v-icon></v-btn>
            </div>
            <v-toolbar-title class="text-h6 font-weight-black text-indigo-darken-4">
                
              {{ calendar?.title || 'Loading...' }}
            </v-toolbar-title>
        

            <v-spacer></v-spacer>

            <v-btn-toggle v-model="type" mandatory variant="flat" background-color="grey-lighten-4" color="indigo-darken-2" class="rounded-lg me-6 border" density="compact">
              <v-btn value="month" class="text-none px-4 font-weight-bold">Month</v-btn>
              <v-btn value="week" class="text-none px-4 font-weight-bold">Week</v-btn>
              <v-btn value="day" class="text-none px-4 font-weight-bold">Day</v-btn>
            </v-btn-toggle>

            <v-btn variant="flat" color="indigo-lighten-5" size="small" class="text-none text-indigo-darken-3 font-weight-bold rounded-lg border" @click="focus = new Date()">Today</v-btn>
          </v-toolbar>

          <div class="calendar-viewport-padding flex-grow-1">
            <v-sheet border class="rounded-xl h-10 overflow-hidden shadow-fancy calendar-inner-sheet">
              <v-calendar
                ref="calendar" v-model="focus" :events="filteredEvents" :type="type" color="indigo"
                first-time="08:00" interval-count="10" interval-minutes="60"
                @click:event="openDialogForEdit"
                @mousedown:event="startDrag" @mousedown:time="startTime"
                @mousemove:time="mouseMove" @mouseup:time="endDrag" @mouseleave="endDrag"
                class="custom-calendar-ui"
              >
                <template v-slot:event="{ event, timed }">
                  <div class="event-modern-card px-2 d-flex align-center h-100" :style="`background-color: ${event.color}25; border-left: 4px solid ${event.color}`">
                    <div class="text-caption font-weight-black text-grey-darken-4 text-truncate">{{ event.name }}</div>
                  </div>
                  <div v-if="timed" class="v-event-drag-bottom" @mousedown.stop="extendBottom(event)"></div>
                </template>
              </v-calendar>
            </v-sheet>
          </div>
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="dialog" max-width="450" persistent>
      <v-card class="rounded-xl shadow-lg border-t-8" :style="`border-top-color: ${newEvent.color}`">
        <v-card-text class="pa-8">
          <div class="text-h6 font-weight-black mb-6 text-indigo-darken-4">{{ isEditing ? 'Update Plan' : 'New Plan' }}</div>
          <v-form>
            <v-text-field v-model="newEvent.title" label="Activity Name" variant="outlined" density="comfortable" color="indigo" class="mb-4"></v-text-field>
          
            <v-row dense class="mb-4">
              <v-col cols="6"><v-text-field v-model="newEvent.start" type="date" label="Start" variant="outlined" density="comfortable" color="indigo"></v-text-field></v-col>
              <v-col cols="6"><v-text-field v-model="newEvent.end" type="date" label="End" variant="outlined" density="comfortable" color="indigo"></v-text-field></v-col>
            </v-row>
            
            <v-select v-model="newEvent.userId" :items="users" item-title="name" item-value="id" label="Member" variant="outlined" density="comfortable" color="indigo" class="mb-6"></v-select>
            
            <div class="text-caption text-grey-darken-1 font-weight-bold mb-3">ACCENT COLOR</div>
            <div class="d-flex justify-space-between mb-8">
              <div v-for="color in ['#5C6BC0', '#F06292', '#4DB6AC', '#FF8A65', '#9575CD']" :key="color" @click="newEvent.color = color" class="color-dot-ui" :style="`background-color: ${color}; outline: ${newEvent.color === color ? '2px solid '+color : 'none'}; outline-offset: 2px;`"></div>
            </div>

            <v-textarea 
              v-model="newEvent.details" 
              label="Details" 
              variant="outlined" 
              rows="3" 
              color="indigo" 
              class="rounded-lg"
              hide-details
            ></v-textarea>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-6 border-t">
          <v-btn v-if="isEditing" color="error" variant="text" @click="deleteEvent">Remove</v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="text" color="grey" @click="dialog = false">Cancel</v-btn>
          <v-btn color="indigo-darken-2" variant="flat" class="text-none px-8 rounded-lg font-weight-bold" @click="saveEvent">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </default-layout>
</template>

<script setup>
import { useCalendar } from '@/utils/usecalendar'
const {
  calendar, focus, type, dialog, isEditing, newEvent, users, selectedUserId, filteredEvents,
  startDrag, startTime, mouseMove, endDrag, extendBottom, openDialogForAdd, openDialogForEdit, saveEvent, deleteEvent, setDuration
} = useCalendar()
</script>

<style scoped>
/* ล็อค Scroll ของ Browser */
:global(html), :global(body) {
  overflow: hidden !important;
  height: 100% !important;
  width: 100% !important;
  margin: 0; padding: 0;
}

/* ล็อคแอปให้อยู่ในพื้นที่จอที่เหลือ */
.planner-main-frame {
  position: fixed;
  top: 64px; /* ความสูง Header */
  left: 0; right: 0; bottom: 0;
  overflow: hidden !important;
}

.h-100 { height: 100% !important; }
.flex-none { flex: none; }

/* จัดการระยะขอบของปฏิทิน (เพิ่มช่องว่างให้ดูมินิมอล) */
.calendar-viewport-padding {
  height: calc(100% - 70px); /* ลบ Toolbar */
  padding: 24px; /* เพิ่มพื้นที่รอบปฏิทินเพื่อให้ดูไม่เต็มจอเกินไป */
  background-color: #f8f9fa; /* พื้นหลังด้านหลังปฏิทิน */
}

.calendar-inner-sheet {
  background: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
}

.custom-calendar-ui {
  height: 100% !important;
}

:deep(.v-calendar) {
  height: 100% !important;
}

/* ปรับแต่งรายละเอียด */
:deep(.v-calendar-weekly__head-weekday) {
  background-color: #fcfcfc;
  padding: 12px 0;
  font-weight: 900;
  color: #3f51b5;
  font-size: 0.75rem;
}

.member-item :deep(.v-list-item-title) { font-weight: 600 !important; color: #455a64 !important; }
.color-dot-ui { width: 26px; height: 26px; border-radius: 50%; cursor: pointer; transition: transform 0.2s; }
.v-event-drag-bottom { position: absolute; left: 0; right: 0; bottom: 0; height: 6px; cursor: ns-resize; }
.shadow-fancy { box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important; }
.custom-scrollbar::-webkit-scrollbar { width: 0px; }
</style>