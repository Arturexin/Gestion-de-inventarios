<script setup>
import { useId } from 'vue';

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
                type="text" 
                :placeholder="`Escribe ${props.label.toLowerCase()}`" 
                class="input-text" 
                @input="$emit('update:modelValue', $event.target.value)"
                :maxlength="props.numCaracteres"
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

.input-text {
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

.input-text:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.input-text::placeholder {
    color: #a0aec0;
}
</style>