<template>
  <li
    class="list-group-item d-flex justify-content-between align-items-center rounded shadow-sm mb-3"
  >
    <!-- ซ้าย: Checkbox + ชื่อรายการ -->
    <label class="form-check-label d-flex align-items-center gap-3 flex-grow-1 mb-0 cursor-pointer">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="$emit('toggle-completed', todo)"
        class="form-check-input me-3"
      />
      <span
        :class="todo.completed ? 'text-muted fst-italic text-decoration-line-through' : 'fw-semibold text-dark'"
        style="word-break: break-word;"
      >
        {{ todo.title }}
      </span>
    </label>

    <!-- ขวา: ปุ่มลบ -->
    <button
      @click="$emit('delete-todo', todo)"
      class="btn btn-link text-danger delete-btn ms-3"
      title="ลบรายการ"
      style="font-size: 1.25rem;"
    >
      ลบ 🗑️
    </button>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  todo: {
    id: number;
    title: string;
    completed: boolean;
  };
}>();
</script>