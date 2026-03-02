<template>
    <default-layout>
        <v-container fluid>
            <h2 class="mb-4">Resource Capacity Planning</h2>

            <v-row class="mb-2">
                <v-col cols="12">
                    <v-alert density="compact" type="info" variant="tonal" border="start">
                        <strong>Planning Rule:</strong> Max 1.0 Man-day (8h) per person/day.
                        Current View: <strong>
                            {{ startDate?.toLocaleDateString() }} - {{ endDate?.toLocaleDateString() }}
                        </strong>
                    </v-alert>
                </v-col>
            </v-row>

            <v-card elevation="2" border>
                <div class="calendar-header pa-4 d-flex align-center bg-grey-lighten-4">
                    <v-btn variant="text" icon="mdi-chevron-left" @click="changeWeek(-7)"></v-btn>
                    <v-spacer></v-spacer>
                    <h3 class="text-primary">{{ currentMonthYear }}</h3>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" icon="mdi-chevron-right" @click="changeWeek(7)"></v-btn>
                </div>

                <v-table class="schedule-table" hover>
                    <thead>
                        <tr>
                            <th class="bg-grey-lighten-3" style="width: 200px">Team Member</th>
                            <th v-for="date in weekDates" :key="date" class="text-center bg-grey-lighten-3">
                                {{ formatDate(date) }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in resources" :key="user.id">
                            <td class="font-weight-bold border-end">
                                <v-avatar size="24" color="primary" class="mr-2 text-white text-caption">
                                    {{ user.name[0] }}
                                </v-avatar>
                                {{ user.name }}
                            </td>

                            <td v-for="date in weekDates" :key="date" class="pa-1 border text-center"
                                style="height: 80px; width: 150px;">
                                <div v-if="getTask(user.id, date)" class="task-slot pa-2 rounded text-caption"
                                    :class="getTaskColor(getTask(user.id, date).md)">
                                    <div class="font-weight-bold">{{ getTask(user.id, date).title }}</div>
                                    <v-chip size="x-small" density="compact" variant="flat" class="mt-1">
                                        {{ getTask(user.id, date).md }} MD
                                    </v-chip>
                                </div>

                                <div v-else class="text-caption text-grey-lighten-1 mt-2">
                                    -- Available --
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card>
        </v-container>
    </default-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import DefaultLayout from '@/components/DefaultLayout.vue';

// ช่วงวันที่ Default เป็นสัปดาห์ปัจจุบัน
const startDate = ref(new Date());

const weekDates = computed(() => {
    return Array.from({ length: 5 }, (_, i) => {
        const d = new Date(startDate.value);
        d.setDate(d.getDate() + i);
        return d.toISOString().split('T')[0];
    });
});

const currentMonthYear = computed(() => {
    return startDate.value.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    }) ?? 'Select Date'
});

// ข้อมูล Resources 
const resources = [
    { id: 'u1', name: 'Touchhh' },
    { id: 'u2', name: 'Developer B' },
    { id: 'u3', name: 'Designer C' },
];

// ข้อมูล Tasks (Mockup ข้อมูลจากระบบ ERP)
const tasks = ref([
    { id: 101, userId: 'u1', date: '2026-03-02', title: 'Setup NestJS', md: 1.0 },
    { id: 102, userId: 'u1', date: '2026-03-03', title: 'Database Schema', md: 0.5 },
    { id: 103, userId: 'u2', date: '2026-03-04', title: 'Vue Integration', md: 0.3 },
]);

// Logic Functions
const getTask = (userId, date) => {
    return tasks.value.find(t => t.userId === userId && t.date === date);
};

const getTaskColor = (md) => {
    if (md > 1.0) return 'bg-red-lighten-4 border-red'; // Overload
    if (md < 1.0) return 'bg-green-lighten-4 border-green';
    return 'bg-blue-lighten-4 border-blue';
};

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
};

const changeWeek = (days) => {
    if (!startDate.value) return;

    const newDate = new Date(startDate.value);
    newDate.setDate(newDate.getDate() + days);

    if (!isNaN(newDate.getTime())) {
        startDate.value = newDate;
    }
};
</script>

<style scoped>
.schedule-table {
    border: 1px solid #e0e0e0;
}

.task-slot {
    transition: transform 0.2s;
    border-left: 4px solid #1976d2;
    min-height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.task-slot:hover {
    transform: scale(1.02);
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.border-red {
    border-left-color: #D32F2F !important;
}

.border-green {
    border-left-color: #388E3C !important;
}

.border-blue {
    border-left-color: #1976D2 !important;
}
</style>