<script setup>
import { computed, useId } from 'vue';

const inputId = useId();
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    label: {
        type: String,
        required: false,
        default: 'Cantidad'
    },
    modelValue: {
        type: [String, Number],
        required: false,
        default: 0
    },
    min: {
        type: Number,
        required: false,
        default: 0
    },
    max: {
        type: Number,
        required: false,
        default: 1000000
    },
    step: {
        type: Number,
        required: false,
        default: 1
    }
});

const numericValue = computed(() => {
    const parsed = Number(props.modelValue);
    return Number.isFinite(parsed) ? parsed : props.min;
});

function clamp(value) {
    return Math.min(props.max, Math.max(props.min, value));
}

function emitValue(value) {
    emit('update:modelValue', clamp(value));
}

function decrement() {
    emitValue(numericValue.value - props.step);
}

function increment() {
    emitValue(numericValue.value + props.step);
}

function handleInput(event) {
    const rawValue = Number(event.target.value);

    if (!Number.isFinite(rawValue)) {
        emitValue(props.min);
        event.target.value = props.min;
        return;
    }

    const nextValue = clamp(rawValue);
    emit('update:modelValue', nextValue);
    event.target.value = nextValue;
}
</script>

<template>
    <div class="container-input">
        <label :for="inputId">
            {{ props.label }}
        </label>

        <div class="quantity-wrapper">
            <button
                type="button"
                class="btn-qty"
                @click="decrement"
                :disabled="numericValue <= props.min"
                aria-label="Disminuir cantidad"
            >
                -
            </button>

            <input
                :id="inputId"
                :value="numericValue"
                type="text"
                class="input-cant"
                :min="props.min"
                :max="props.max"
                :step="props.step"
                @input="handleInput"
            >

            <button
                type="button"
                class="btn-qty"
                @click="increment"
                :disabled="numericValue >= props.max"
                aria-label="Aumentar cantidad"
            >
                +
            </button>
        </div>
    </div>
</template>

<style scoped>
.container-input {
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

.quantity-wrapper {
    display: grid;
    grid-template-columns: 40px 1fr 40px;
    align-items: center;
    gap: 8px;
}

.input-cant {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    font-size: 0.9rem;
    text-align: center;
    color: #2d3748;
    background-color: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
}

.input-cant:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.btn-qty {
    height: 36px;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    background-color: #f7fafc;
    color: #2d3748;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.15s, border-color 0.15s, transform 0.05s;
}

.btn-qty:hover:not(:disabled) {
    background-color: #edf2f7;
    border-color: #a0aec0;
}

.btn-qty:active:not(:disabled) {
    transform: translateY(1px);
}

.btn-qty:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.input-cant::-webkit-inner-spin-button,
.input-cant::-webkit-outer-spin-button {
    opacity: 1;
}
</style>