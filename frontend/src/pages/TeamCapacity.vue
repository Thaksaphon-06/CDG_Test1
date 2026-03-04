<template>
    <default-layout>
        <v-container fluid>
            <div class="d-flex align-center mb-4">
                <h2 class="mb-0">Resource Capacity Planning</h2>
                <v-spacer></v-spacer>
                <v-btn-toggle v-model="viewMode" divided variant="outlined" color="primary" mandatory>
                    <v-btn value="month">Month</v-btn>
                    <v-btn value="week">Week</v-btn>
                    <v-btn value="day">Day</v-btn>
                </v-btn-toggle>
            </div>

            <v-row class="mb-2">
                <v-col cols="12">
                    <v-alert density="compact" type="info" variant="tonal" border="start">
                        <strong>Rule:</strong> Max 8h per person/day.
                        View: <strong>{{ displayRangeText }}</strong>
                    </v-alert>
                </v-col>
            </v-row>

            <v-card elevation="2" border>
                <div class="calendar-header pa-4 d-flex align-center bg-grey-lighten-4">
                    <v-btn variant="text" icon="mdi-chevron-left" @click="navigate(-1)"></v-btn>
                    <v-spacer></v-spacer>
                    <h3 class="text-primary">{{ currentLabel }}</h3>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" icon="mdi-chevron-right" @click="navigate(1)"></v-btn>
                </div>

                <v-table class="schedule-table" hover fixed-header>
                    <thead>
                        <tr>
                            <th class="bg-grey-lighten-3" style="min-width: 180px">Team Member</th>
                            <th v-for="col in tableColumns" :key="col.id"
                                class="text-center bg-grey-lighten-3 border-start">
                                <div class="text-caption font-weight-bold">{{ col.title }}</div>
                                <div class="text-overline" v-if="col.subtitle">{{ col.subtitle }}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in resources" :key="user.id">
                            <td class="font-weight-bold border-end bg-white">
                                <v-avatar size="24" color="primary" class="mr-2 text-white text-caption">
                                    {{ user.name[0] }}
                                </v-avatar>
                                {{ user.name }}
                            </td>

                            <td v-for="col in tableColumns" :key="col.id"
                                class="pa-1 border-start text-center cell-slot">
                                <div v-if="getTaskAt(user.id, col.id)" class="task-slot pa-1 rounded"
                                    :class="getTaskColor(getTaskAt(user.id, col.id).md || 0.5)">
                                    <div class="task-title">{{ getTaskAt(user.id, col.id).title }}</div>
                                    <div class="text-xxs" v-if="viewMode !== 'day'">
                                        {{ getTaskAt(user.id, col.id).md }} MD
                                    </div>
                                </div>
                                <div v-else class="empty-slot">--</div>
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

const viewMode = ref('week'); // 'month', 'week', 'day'
const referenceDate = ref(new Date());

// คำนวณ Columns ตาม Mode
const tableColumns = computed(() => {
    const cols = [];
    const curr = new Date(referenceDate.value);

    if (viewMode.value === 'day') {

        for (let i = 8; i <= 17; i++) {
            cols.push({
                id: `${curr.toISOString().split('T')[0]}_H${i}`,
                title: `${i}:00`,
                subtitle: i < 12 ? 'AM' : 'PM',
                rawDate: curr.toISOString().split('T')[0],
                hour: i
            });
        }
    } else if (viewMode.value === 'week') {

        const startOfWeek = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1));
        for (let i = 0; i < 5; i++) {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            cols.push({
                id: dateStr,
                title: d.toLocaleDateString('en-US', { weekday: 'short' }),
                subtitle: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
                rawDate: dateStr
            });
        }
    } else {

        const year = curr.getFullYear();
        const month = curr.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month, i);
            if (d.getDay() !== 0 && d.getDay() !== 6) { // เว้นเสาร์-อาทิตย์
                const dateStr = d.toISOString().split('T')[0];
                cols.push({
                    id: dateStr,
                    title: i.toString(),
                    subtitle: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
                    rawDate: dateStr
                });
            }
        }
    }
    return cols;
});

// Navigation Logic
const navigate = (step) => {
    const d = new Date(referenceDate.value);
    if (viewMode.value === 'day') d.setDate(d.getDate() + step);
    else if (viewMode.value === 'week') d.setDate(d.getDate() + (step * 7));
    else d.setMonth(d.getMonth() + step);
    referenceDate.value = d;
};

const currentLabel = computed(() => {
    const opt = { month: 'long', year: 'numeric' };
    if (viewMode.value === 'day') opt.day = 'numeric';
    return referenceDate.value.toLocaleDateString('en-US', opt);
});

// Data & Matching Logic
const resources = [
    { id: 'u1', name: 'Touchhh' },
    { id: 'u2', name: 'Developer B' }
];
 
const tasks = ref([
    { id: 1, userId: 'u1', date: '2026-03-02', title: 'ERP API', md: 1.0, hour: 9 },
    { id: 2, userId: 'u1', date: '2026-03-02', title: 'Meeting', md: 0.2, hour: 14 },
    { id: 3, userId: 'u2', date: '2026-03-04', title: 'UI Fix', md: 0.5, hour: 10 }
]);

const getTaskAt = (userId, colId) => {
    if (viewMode.value === 'day') {
        const [date, hourStr] = colId.split('_H');
        return tasks.value.find(t => t.userId === userId && t.date === date && t.hour === parseInt(hourStr));
    } else {
        return tasks.value.find(t => t.userId === userId && t.date === colId);
    }
};

const getTaskColor = (md) => {
    if (md >= 1.0) return 'bg-blue-lighten-4 border-blue';
    return 'bg-green-lighten-4 border-green';
};
</script>

<style scoped>
.schedule-table {
    border: 1px solid #e0e0e0;
}

.cell-slot {
    height: 70px;
    min-width: 60px;
    vertical-align: middle;
}

.task-slot {
    font-size: 0.7rem;
    border-left: 3px solid #1976d2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
}

.task-title {
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.empty-slot {
    color: #bdbdbd;
    font-size: 0.75rem;
}

.text-xxs {
    font-size: 0.6rem;
}

.border-green {
    border-left-color: #4CAF50 !important;
}

.border-blue {
    border-left-color: #2196F3 !important;
}
</style>