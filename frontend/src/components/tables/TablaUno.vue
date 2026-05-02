<script setup>
import { computed, defineEmits, defineProps, onBeforeUnmount, reactive, watch } from 'vue';

const emit = defineEmits(['selection-change', 'update:selectedRows']);

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    onButton: {
        type: String,
        required: false,
        default: ''
    },
    offButton: {
        type: String,
        required: false,
        default: ''
    },
    columns: {
        type: Array,
        required: true
    },
    rows: {
        type: Array,
        required: true
    },
    selectedRows: {
        type: Array,
        required: false,
        default: () => []
    },
    select: {
        type: Boolean,
        required: false,
        default: false
    }
});

const DEBOUNCE_MS = 300;
const filterValues = reactive({});
const debouncedFilterValues = reactive({});
const filterTimers = {};
const selectedRowKeys = reactive({});

function getRowKey(row, index) {
    return row?.id ?? index;
}

function getRowIndex(row) {
    return props.rows.indexOf(row);
}

function isRowSelected(row, index) {
    return selectedRowKeys[getRowKey(row, index)] === true;
}

function setRowSelection(row, index, checked) {
    const rowKey = getRowKey(row, index);

    if (checked) {
        selectedRowKeys[rowKey] = true;
        return;
    }

    delete selectedRowKeys[rowKey];
}

function handleFilterInput(columnValue, value) {
    filterValues[columnValue] = value;

    if (filterTimers[columnValue]) {
        clearTimeout(filterTimers[columnValue]);
    }

    filterTimers[columnValue] = setTimeout(() => {
        debouncedFilterValues[columnValue] = value;
        delete filterTimers[columnValue];
    }, DEBOUNCE_MS);
}

onBeforeUnmount(() => {
    Object.values(filterTimers).forEach((timerId) => clearTimeout(timerId));
});

function buildSelectedRowKeyMap(rows) {
    const nextSelectedRowKeys = {};

    props.rows.forEach((row, index) => {
        const isSelected = rows.some((selectedRow) => {
            if (row?.id != null && selectedRow?.id != null) {
                return row.id === selectedRow.id;
            }

            return selectedRow === row;
        });

        if (isSelected) {
            nextSelectedRowKeys[getRowKey(row, index)] = true;
        }
    });

    return nextSelectedRowKeys;
}

function hasSameSelectedRowKeys(nextSelectedRowKeys) {
    const currentKeys = Object.keys(selectedRowKeys).filter((key) => selectedRowKeys[key]).sort();
    const nextKeys = Object.keys(nextSelectedRowKeys).sort();

    if (currentKeys.length !== nextKeys.length) {
        return false;
    }

    return currentKeys.every((key, index) => key === nextKeys[index]);
}

function replaceSelectedRowKeys(nextSelectedRowKeys) {
    Object.keys(selectedRowKeys).forEach((key) => delete selectedRowKeys[key]);
    Object.keys(nextSelectedRowKeys).forEach((key) => {
        selectedRowKeys[key] = true;
    });
}

const filteredRows = computed(() => {
    const activeColumns = props.columns.filter((column) => column?.filter === true && column?.value);

    if (activeColumns.length === 0) {
        return props.rows;
    }

    return props.rows.filter((row) => {
        return activeColumns.every((column) => {
            const query = (debouncedFilterValues[column.value] || '').trim().toLowerCase();

            if (!query) {
                return true;
            }

            const cellValue = row?.[column.value];
            return String(cellValue ?? '').toLowerCase().includes(query);
        });
    });
});

const internalSelectedRows = computed(() => {
    return props.rows.filter((row, index) => isRowSelected(row, index));
});

watch(() => props.selectedRows, (rows) => {
    const nextSelectedRowKeys = buildSelectedRowKeyMap(rows || []);

    if (!hasSameSelectedRowKeys(nextSelectedRowKeys)) {
        replaceSelectedRowKeys(nextSelectedRowKeys);
    }
}, { immediate: true, deep: true });

watch(internalSelectedRows, (rows) => {
    emit('selection-change', rows);
    const modelSelectedRowKeys = buildSelectedRowKeyMap(props.selectedRows || []);

    if (!hasSameSelectedRowKeys(modelSelectedRowKeys)) {
        emit('update:selectedRows', rows);
    }
}, { immediate: true });

const allFilteredRowsSelected = computed(() => {
    return filteredRows.value.length > 0
        && filteredRows.value.every((row) => {
            const rowIndex = getRowIndex(row);
            return isRowSelected(row, rowIndex);
        });
});

function toggleAllFilteredRows(checked) {
    filteredRows.value.forEach((row) => {
        const rowIndex = getRowIndex(row);
        setRowSelection(row, rowIndex, checked);
    });
}

const countRows = computed(() => filteredRows.value.length);

</script>

<template>
    <div class="table-shell">
        <table class="data-table">
            <thead>
                <tr>
                    <th :colspan="props.select ? columns.length + 1 : columns.length" class="table-title">{{ title }}</th>
                </tr>
                <tr class="head-row">
                    <td v-if="props.select" class="select-cell">
                        <input
                            class="table-checkbox"
                            type="checkbox"
                            :checked="allFilteredRowsSelected"
                            @change="toggleAllFilteredRows($event.target.checked)"
                        >
                    </td>
                    <th v-for="column in columns" :key="column.value || column.label">
                        {{ column?.title === false ? '' : column.label }}
                    </th>
                </tr>
                <tr class="filter-row">
                    <td v-if="props.select" class="select-cell"></td>
                    <template v-for="column in columns" :key="column.value || column.label">
                        <th v-if="column?.filter === true">
                            <input
                                class="input-filter"
                                :value="filterValues[column.value] || ''"
                                @input="handleFilterInput(column.value, $event.target.value)"
                                type="text"
                                :placeholder="`Filtrar ${column.label}`"
                            >
                        </th>
                        <th v-else></th>
                    </template>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in filteredRows" :key="getRowKey(row, getRowIndex(row))">
                    <td v-if="props.select" class="select-cell">
                        <input
                            class="table-checkbox"
                            type="checkbox"
                            :checked="isRowSelected(row, getRowIndex(row))"
                            @change="setRowSelection(row, getRowIndex(row), $event.target.checked)"
                        >
                    </td>
                    <td v-for="column of columns"
                        :style="{ 
                                width: column?.style?.width ?? 'auto', 
                                fontSize: column?.style?.fontSize ?? 'inherit', 
                                textAlign: column?.style?.textAlign ?? 'left', 
                                backgroundColor: column?.style?.backgroundColor ?? 'transparent', 
                                color: column?.style?.color ?? 'var(--c-a-dark)' }"
                        :key="column.value"
                    >
                        {{ column?.button === true ? '' : row[column.value] }}
                        <div v-if="column?.button === true">
                            <button class="action-button" @click="column.method">{{ column.label }}</button>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td :colspan="props.select ? columns.length + 1 : columns.length">
                        <div class="footer_">
                            <div></div>
                            <div></div>
                            <div>Total {{ countRows }} filas</div>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<style scoped>
.table-shell,
.data-table {
    --b-a-dark: #373b44;
    --b-a-light: #dfe5eb;
    --c-a-light: #eee;
    --c-a-dark: #333;
}

.table-shell {
    width: 100%;
    overflow: hidden;
    border: 1px solid var(--b-a-dark);
    border-radius: 16px;
    background: linear-gradient(180deg, var(--b-a-light) 0%, var(--c-a-light) 100%);
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.22);
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    background: transparent;
}

th,
td {
    border-bottom: 1px solid var(--b-a-dark);
    padding: 5px 14px;
    color: var(--c-a-dark);
}

thead th,
thead td {
    border-bottom: 1px solid var(--b-a-dark);
}

.table-title {
    padding: 16px 18px;
    text-align: center;
    font-size: 0.96rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--c-a-light);
    background: var(--b-a-dark);
}

.head-row th,
.head-row td {
    background-color: var(--b-a-dark);
    color: var(--b-a-light);
    font-size: 0.82rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.filter-row th,
.filter-row td {
    background-color: var(--b-a-dark);
}

tbody tr {
    background-color: #d4dde7;
    transition: background-color 140ms ease;
}

tbody tr:nth-child(even) {
    background-color: #bfcad7;
}

tbody tr:hover {
    background-color: #a796af;
}

tbody td {
    color: var(--c-a-dark);
}

.select-cell {
    width: 42px;
    padding: 0;
    text-align: center;
}

input[type="checkbox"] {
    accent-color: var(--b-a-light);
}

.table-checkbox {
    appearance: none;
    -webkit-appearance: none;
    width: 17px;
    height: 17px;
    margin: 0;
    border: 1px solid var(--b-a-dark);
    border-radius: 5px;
    background: linear-gradient(180deg, var(--c-a-light) 0%, var(--b-a-light) 100%);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
    cursor: pointer;
    position: relative;
    transition: border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease, transform 120ms ease;
}

.table-checkbox:hover {
    border-color: var(--c-a-dark);
    background: linear-gradient(180deg, #ffffff 0%, #e9edf1 100%);
}

.table-checkbox:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(55, 59, 68, 0.16);
}

.table-checkbox:checked {
    border-color: var(--c-a-dark);
    background: linear-gradient(180deg, var(--b-a-dark) 0%, var(--c-a-dark) 100%);
}

.table-checkbox:checked::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 1px;
    width: 4px;
    height: 8px;
    border: solid var(--c-a-light);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.table-checkbox:active {
    transform: scale(0.96);
}

tfoot td {
    font-weight: bold;
    background-color: var(--b-a-dark);
    color: var(--b-a-light);
    border-bottom: none;
    padding: 12px 18px;
}

.footer_ {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
}

.input-filter {
    width: 100%;
    padding: 6px 11px;
    box-sizing: border-box;
    border: 1px solid var(--b-a-light);
    border-radius: 10px;
    background-color: rgba(238, 238, 238, 0.08);
    color: var(--c-a-light);
    outline: none;
    transition: border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease;
}

.input-filter::placeholder {
    color: rgba(238, 238, 238, 0.6);
}

.input-filter:focus {
    border-color: var(--c-a-light);
    box-shadow: 0 0 0 3px rgba(223, 229, 235, 0.14);
    background-color: rgba(238, 238, 238, 0.14);
}

.action-button {
    min-width: 92px;
    padding: 8px 12px;
    border: 1px solid var(--b-a-dark);
    border-radius: 10px;
    background: linear-gradient(180deg, var(--b-a-dark) 0%, var(--c-a-dark) 100%);
    color: var(--c-a-light);
    cursor: pointer;
    transition: transform 120ms ease, filter 120ms ease, border-color 120ms ease;
}

.action-button:hover {
    filter: brightness(1.08);
    border-color: var(--b-a-light);
}

.action-button:active {
    transform: translateY(1px);
}
</style>