<script setup>
import { computed, ref, useId, watch } from 'vue';

const inputId = useId();

const props = defineProps({
    group: {
        type: Array,
        required: true
    },
    label: {
        type: String,
        required: false
    },
    modelValue: {
        type: [String, Number],
        required: false,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue']);
const searchTerm = ref('');
const isOpen = ref(false);
const highlightedIndex = ref(-1);

const filteredGroup = computed(() => {
    const term = searchTerm.value.trim().toLowerCase();

    if (!term) {
        return props.group;
    }

    return props.group.filter((item) => {
        const label = String(item.label ?? '').toLowerCase();
        const value = String(item.value ?? '').toLowerCase();
        return label.includes(term) || value.includes(term);
    });
});

const selectedValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const selectedLabel = computed(() => {
    const selected = props.group.find((item) => String(item.value) === String(selectedValue.value));
    return selected?.label ?? '';
});

const displayText = computed({
    get: () => searchTerm.value || selectedLabel.value,
    set: (value) => {
        searchTerm.value = value;
        isOpen.value = true;
    }
});

function selectOption(item) {
    selectedValue.value = item.value;
    searchTerm.value = item.label;
    isOpen.value = false;
    highlightedIndex.value = -1;
}

function openList() {
    isOpen.value = true;
    highlightedIndex.value = filteredGroup.value.length > 0 ? 0 : -1;
}

function closeList() {
    setTimeout(() => {
        isOpen.value = false;
        searchTerm.value = '';
        highlightedIndex.value = -1;
    }, 120);
}

function handleKeydown(event) {
    const hasOptions = filteredGroup.value.length > 0;

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (!isOpen.value) {
            openList();
            return;
        }
        if (!hasOptions) {
            return;
        }
        highlightedIndex.value = (highlightedIndex.value + 1) % filteredGroup.value.length;
        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (!isOpen.value) {
            openList();
            return;
        }
        if (!hasOptions) {
            return;
        }
        highlightedIndex.value =
            (highlightedIndex.value - 1 + filteredGroup.value.length) % filteredGroup.value.length;
        return;
    }

    if (event.key === 'Enter') {
        if (!isOpen.value || !hasOptions || highlightedIndex.value < 0) {
            return;
        }
        event.preventDefault();
        selectOption(filteredGroup.value[highlightedIndex.value]);
        return;
    }

    if (event.key === 'Escape') {
        isOpen.value = false;
        searchTerm.value = '';
        highlightedIndex.value = -1;
    }
}

watch(filteredGroup, (newGroup) => {
    if (newGroup.length === 0) {
        highlightedIndex.value = -1;
        return;
    }

    if (highlightedIndex.value >= newGroup.length) {
        highlightedIndex.value = 0;
    }
});
</script>

<template>
    <div class="container-select">
        <label :for="inputId">
            {{ props.label }}
        </label>
        <div class="dropdown">
            <input
                :id="inputId"
                v-model="displayText"
                type="text"
                class="search-input"
                placeholder="Filtrar opciones"
                autocomplete="off"
                @focus="openList"
                @blur="closeList"
                @keydown="handleKeydown"
            >
            <ul v-if="isOpen" class="options-list">
                <li
                    v-for="(item, index) in filteredGroup"
                    :key="item.value"
                    class="option-item"
                    :class="{ 'is-active': index === highlightedIndex }"
                    @mousedown.prevent="selectOption(item)"
                    @mouseenter="highlightedIndex = index"
                >
                    {{ item.label }}
                </li>
                <li v-if="filteredGroup.length === 0" class="option-empty">
                    Sin resultados
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.container-select {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
}

label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #4a5568;
    letter-spacing: 0.03em;
}

.search-input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #2d3748;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.dropdown {
    position: relative;
}

.options-list {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    width: 100%;
    max-height: 90vh;
    margin: 0;
    padding: 6px;
    list-style: none;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
    overflow-y: auto;
    z-index: 20;
}

.option-item,
.option-empty {
    padding: 8px 10px;
    border-radius: 4px;
    font-size: 0.9rem;
    color: #2d3748;
}

.option-item {
    cursor: pointer;
    transition: background-color 0.15s;
}

.option-item:hover {
    background-color: #edf2f7;
}

.option-item.is-active {
    background-color: #e2e8f0;
}

.option-empty {
    color: #718096;
}
</style>