import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FormField, FormSchema, ValidationRule } from '../types/form'

interface FormBuilderState {
  currentForm: FormSchema
  savedForms: FormSchema[]
  previewMode: boolean
}

const initialState: FormBuilderState = {
  currentForm: {
    id: '',
    name: '',
    fields: [],
    createdAt: new Date().toISOString(),
  },
  savedForms: [],
  previewMode: false,
}

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<FormField>) => {
      state.currentForm.fields.push(action.payload)
    },
    updateField: (state, action: PayloadAction<{ index: number; field: FormField }>) => {
      state.currentForm.fields[action.payload.index] = action.payload.field
    },
    deleteField: (state, action: PayloadAction<number>) => {
      state.currentForm.fields.splice(action.payload, 1)
    },
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload
      const [removed] = state.currentForm.fields.splice(fromIndex, 1)
      state.currentForm.fields.splice(toIndex, 0, removed)
    },
    saveForm: (state, action: PayloadAction<string>) => {
      const formToSave = {
        ...state.currentForm,
        id: Date.now().toString(),
        name: action.payload,
        createdAt: new Date().toISOString(),
      }
      state.savedForms.push(formToSave)
      // Save to localStorage
      localStorage.setItem('formBuilder_savedForms', JSON.stringify(state.savedForms))
    },
    loadSavedForms: (state) => {
      const saved = localStorage.getItem('formBuilder_savedForms')
      if (saved) {
        state.savedForms = JSON.parse(saved)
      }
    },
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload)
      if (form) {
        state.currentForm = { ...form }
      }
    },
    clearCurrentForm: (state) => {
      state.currentForm = {
        id: '',
        name: '',
        fields: [],
        createdAt: new Date().toISOString(),
      }
    },
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.previewMode = action.payload
    },
  },
})

export const {
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  loadSavedForms,
  loadForm,
  clearCurrentForm,
  setPreviewMode,
} = formBuilderSlice.actions

export default formBuilderSlice.reducer
