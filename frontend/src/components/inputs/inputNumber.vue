<script setup>
import { useId, defineProps } from 'vue';

const inputId = useId();
const emit = defineEmits(['update:modelValue']);
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
    },
    numCaracteres: {
        type: Number,
        required: false,
        default: null
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
    }
});
</script>

<template>
    <div class="container-input">
        <label :for="inputId">
            {{ props.label }}
        </label>
        <div>
            <input 
                :id="inputId" 
                :value="modelValue" 
                type="number" 
                :placeholder="`Escribe ${props.label.toLowerCase()}`" 
                class="input-number" 
                @input="$emit('update:modelValue', $event.target.value)" 
                :maxlength="props.numCaracteres"
                :min="props.min ?? undefined"
                :max="props.max ?? undefined"
            >
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

.input-number {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #2d3748;
    background-color: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
}

.input-number:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.input-number::placeholder {
    color: #a0aec0;
}

.input-number::-webkit-inner-spin-button,
.input-number::-webkit-outer-spin-button {
    opacity: 1;
}
</style>