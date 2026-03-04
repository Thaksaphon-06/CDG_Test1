<template>
    <default-layout>
        <v-container fluid>
            <div class="d-flex align-center mb-4">
                <h2 class="mb-0">Resource Capacity Planning</h2>
                <v-spacer></v-spacer>
            
            </div>

            <v-row class="mb-2">
                <v-col cols="12">
                    <v-alert density="compact" type="info" variant="tonal" border="start">
                        <strong>Rule:</strong> Max 8h per person/day.
                        View: <strong>{{ displayRangeText }}</strong>
                    </v-alert>
                </v-col>
            </v-row>

            <v-card elevation="0" border class="calendar-main">
                <div class="calendar-toolbar pa-2 d-flex align-center border-bottom">
                    <h2 class="text-primary text-h5 font-weight-regular px-4">{{ currentLabel }}</h2>
                    <v-spacer></v-spacer>
                    <v-btn-toggle v-model="viewMode" divided variant="outlined" color="primary" mandatory>
                        <v-btn value="month">Month</v-btn>
                        <v-btn value="week">Week</v-btn>
                        <v-btn value="day">Day</v-btn>
                    </v-btn-toggle>
                    <div class="d-flex align-center">
                        <v-btn icon="mdi-chevron-left" variant="text" @click="navigate(-1)"></v-btn>
                        <v-btn variant="outlined" density="compact" class="mx-2 text-primary"
                            @click="goToday">วันนี้</v-btn>
                        <v-btn icon="mdi-chevron-right" variant="text" @click="navigate(1)"></v-btn>
                    </div>
                </div>

                <div class="calendar-container">
                    <div v-if="viewMode !== 'day'" class="day-labels-row">
                        <div v-for="day in dayNames" :key="day" class="day-label">{{ day }}</div>
                    </div>

                    <div class="days-grid" :class="viewMode">
                        <div v-for="cell in calendarCells" :key="cell.id" class="day-cell" :class="{
                            'other-month': viewMode === 'month' && !cell.isCurrentMonth,
                            'hourly-cell': viewMode === 'day'
                        }">
                            <div v-if="viewMode !== 'day'" class="day-header">
                                <span v-if="cell.showMonthName" class="month-name">{{ cell.monthName }}</span>
                                <span :class="['day-number', { 'is-today': cell.isToday }]">
                                    {{ cell.date.getDate() }}
                                </span>
                            </div>

                            <div v-else class="hour-label">
                                {{ cell.hourLabel }}
                            </div>

                            <div class="event-list">
                                <div v-for="task in cell.events" :key="task.id" class="event-bar"
                                    :style="{ backgroundColor: task.color }">
                                    <span class="event-title">{{ task.userName }}: {{ task.title }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </v-card>
        </v-container>
    </default-layout>
</template>

<script setup>
import { ref, computed } from 'vue';

const viewMode = ref('month');
const referenceDate = ref(new Date());
const dayNames = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

// Mockup Data
const tasks = ref([
    { id: 1, userId: 'u1', userName: 'Martin', date: '2026-03-03', title: 'Quick mtg.', color: '#F8BBD0', hour: 10 },
    { id: 2, userId: 'u2', userName: 'Employment', date: '2026-03-04', title: 'Semi-weekly', color: '#B2DFDB', hour: 13 },
    { id: 3, userId: 'u3', userName: 'Mike', date: '2026-03-04', title: 'OFF', color: '#FFF9C4', hour: 9 },
]);

// คำนวณวันที่ที่จะแสดงในตารางตาม viewMode
const calendarCells = computed(() => {
    const cells = [];
    const ref = new Date(referenceDate.value);

    if (viewMode.value === 'month') {
        // โหมดเดือน: 42 ช่อง (6 สัปดาห์)
        const startOfMonth = new Date(ref.getFullYear(), ref.getMonth(), 1);
        const startGrid = new Date(startOfMonth);
        startGrid.setDate(startGrid.getDate() - startGrid.getDay());

        for (let i = 0; i < 42; i++) {
            const d = new Date(startGrid);
            d.setDate(d.getDate() + i);
            cells.push({
                id: `m-${i}`,
                date: d,
                isCurrentMonth: d.getMonth() === ref.getMonth(),
                isToday: d.toDateString() === new Date().toDateString(),
                showMonthName: d.getDate() === 1,
                monthName: d.toLocaleDateString('th-TH', { month: 'short' }),
                events: getTasksForCell(d)
            });
        }
    } else if (viewMode.value === 'week') {
        // โหมดสัปดาห์: 7 ช่อง
        const startOfWeek = new Date(ref);
        startOfWeek.setDate(ref.getDate() - ref.getDay());

        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + i);
            cells.push({
                id: `w-${i}`,
                date: d,
                isToday: d.toDateString() === new Date().toDateString(),
                events: getTasksForCell(d)
            });
        }
    } else if (viewMode.value === 'day') {
        // โหมดวัน: รายชั่วโมง 08:00 - 17:00
        for (let h = 8; h <= 17; h++) {
            cells.push({
                id: `h-${h}`,
                date: ref,
                hourLabel: `${h < 10 ? '0' + h : h}:00`,
                events: getTasksForCell(ref, h)
            });
        }
    }
    return cells;
});

// ฟังก์ชันดึงงานตามวัน/เวลา
const getTasksForCell = (date, hour = null) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.value.filter(t => {
        const matchDate = t.date === dateStr;
        if (hour !== null) return matchDate && t.hour === hour;
        return matchDate;
    });
};

const currentLabel = computed(() => {
    const options = { month: 'long', year: 'numeric' };
    if (viewMode.value === 'day') options.day = 'numeric';
    return referenceDate.value.toLocaleDateString('th-TH', options);
});

const displayRangeText = computed(() => referenceDate.value.toLocaleDateString('th-TH'));

const navigate = (step) => {
    const d = new Date(referenceDate.value);
    if (viewMode.value === 'month') d.setMonth(d.getMonth() + step);
    else if (viewMode.value === 'week') d.setDate(d.getDate() + (step * 7));
    else d.setDate(d.getDate() + step);
    referenceDate.value = d;
};

const goToday = () => referenceDate.value = new Date();
</script>

<style scoped>
.calendar-main {
    background: white;
    border-radius: 8px !important;
}

.calendar-toolbar {
    border-bottom: 1px solid #e0e0e0;
    min-height: 64px;
}

.day-labels-row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    border-bottom: 1px solid #e0e0e0;
}

.day-label {
    padding: 8px;
    text-align: center;
    font-size: 14px;
    color: #5f6368;
    font-weight: 500;
}

/* Dynamic Grid */
.days-grid {
    display: grid;
}

.days-grid.month {
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: minmax(120px, 1fr);
}

.days-grid.week {
    grid-template-columns: repeat(7, 1fr);
    height: 400px;
}

.days-grid.day {
    grid-template-columns: 1fr;
}

.day-cell {
    border-right: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    padding: 4px;
    display: flex;
    flex-direction: column;
}

.day-cell:nth-child(7n) {
    border-right: none;
}

.hourly-cell {
    flex-direction: row;
    align-items: center;
    min-height: 50px;
}

.day-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 4px;
}

.hour-label {
    width: 80px;
    font-size: 13px;
    color: #70757a;
    padding-left: 10px;
}

.day-number {
    font-size: 12px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.is-today {
    background-color: #1a73e8;
    color: white;
}

.other-month {
    background-color: #f8f9fa;
    color: #70757a;
}

.event-list {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.event-bar {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 4px;
    color: #3c4043;
    cursor: pointer;
    margin: 0 2px;
}

.month-name {
    font-size: 12px;
    font-weight: bold;
    margin-right: 4px;
}
</style>