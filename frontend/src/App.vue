<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TodoItem from './components/TodoItems.vue';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const todos = ref<Todo[]>([]);
const newTodo = ref('');

const API_BASE = 'http://localhost:4000/api';

async function fetchTodos() {
  try {
    const res = await fetch(`${API_BASE}/todos`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch todos');
    }
    todos.value = await res.json();
  } catch (error) {
    console.error('Fetch todos failed:', error);
    todos.value = [];
  }
}

async function addTodo() {
  const title = newTodo.value.trim();
  if (!title) return;

  try {
    const res = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    const created = await res.json();
    todos.value.unshift(created);
    newTodo.value = '';
  } catch (error) {
    console.error('Add todo failed:', error);
  }
}

async function toggleCompleted(todo: Todo) {
  try {
    const res = await fetch(`${API_BASE}/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    const updated = await res.json();
    const index = todos.value.findIndex((t) => t.id === updated.id);
    if (index !== -1) todos.value[index] = updated;
  } catch (error) {
    console.error('Toggle completed failed:', error);
  }
}

async function deleteTodo(todo: Todo) {
  try {
    await fetch(`${API_BASE}/todos/${todo.id}`, {
      method: 'DELETE',
    });
    todos.value = todos.value.filter((t) => t.id !== todo.id);
  } catch (error) {
    console.error('Delete todo failed:', error);
  }
}

onMounted(fetchTodos);
</script>

<template>
  <div class="container-fluid">
    <div class="box">
      <h1 class="mb-4 text-center">Todo List</h1>

      <form @submit.prevent="addTodo" class="mb-4 w-100 d-flex">
        <input 
          v-model="newTodo" 
          type="text" 
          class="form-control me-2" 
          placeholder="เพิ่มรายการใหม่..." 
        />
        <button 
          type="submit" 
          class="btn btn-primary" 
          :disabled="!newTodo.trim()"
        >
          เพิ่ม
        </button>
      </form>

      <ul class="list-group w-100">
        <TodoItem 
          v-for="todo in todos" 
          :key="todo.id" 
          :todo="todo" 
          @toggle-completed="toggleCompleted"
          @delete-todo="deleteTodo" 
        />
      </ul>

      <p v-if="todos.length === 0" class="text-center text-muted mt-4">
        ไม่มีรายการ todo
      </p>
    </div>
  </div>
</template>
