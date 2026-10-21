<script setup lang="ts">
import { ref, computed } from "vue";
import { TempisTimeline } from "@tempis/vue";
import type { TempisTimelineItem, TempisTimelineCategory, TempisTimelineExposed } from "@tempis/vue";

const timelineRef = ref<TempisTimelineExposed | null>(null);

const categories = ref<TempisTimelineCategory[]>([
  { name: "dev", label: "Development", style: { backgroundColor: "#6366f1", fontColor: "#fff" } },
  { name: "design", label: "Design", style: { backgroundColor: "#ff0071", fontColor: "#fff" } },
  { name: "qa", label: "QA", style: { backgroundColor: "#10b981", fontColor: "#fff" } },
  { name: "ops", label: "Ops", style: { backgroundColor: "#f59e0b", fontColor: "#111" } },
]);

const items = ref<TempisTimelineItem[]>([
  { id: 1, label: "Auth Module", start: "2026-01-05", end: "2026-01-18", grouping: "Sprint 1", category: "dev", progress: 1.0 },
  { id: 2, label: "UI Mockups", start: "2026-01-03", end: "2026-01-10", grouping: "Sprint 1", category: "design", progress: 1.0 },
  { id: 3, label: "API Gateway", start: "2026-01-12", end: "2026-01-25", grouping: "Sprint 1", category: "dev", progress: 0.7 },
  { id: 4, label: "Integration Tests", start: "2026-01-20", end: "2026-01-28", grouping: "Sprint 2", category: "qa", progress: 0.4 },
  { id: 5, label: "Dashboard", start: "2026-01-22", end: "2026-02-05", grouping: "Sprint 2", category: "dev", progress: 0.2 },
  { id: 6, label: "Design Review", start: "2026-01-28", grouping: "Sprint 2", category: "design" },
  { id: 7, label: "Performance Tests", start: "2026-02-01", end: "2026-02-08", grouping: "Sprint 2", category: "qa", progress: 0 },
  { id: 8, label: "Launch Prep", start: "2026-02-05", end: "2026-02-12", grouping: "Sprint 3", category: "ops", progress: 0 },
  { id: 9, label: "Deploy to Staging", start: "2026-02-10", end: "2026-02-13", grouping: "Sprint 3", category: "ops", progress: 0 },
  { id: 10, label: "Go Live", start: "2026-02-14", grouping: "Sprint 3", category: "ops" },
]);

const selectedIds = ref<(string | number)[]>([]);
const showPanel = computed(() => selectedIds.value.length > 0);
const selectedItem = computed(() => {
  if (selectedIds.value.length !== 1) return null;
  return items.value.find(i => i.id === selectedIds.value[0]) ?? null;
});

// Editing state
const editLabel = ref("");
const editProgress = ref(0);
const editCategory = ref("");

function onSelectionUpdate(newSelection: (string | number)[]) {
  selectedIds.value = newSelection;

  // Populate edit fields
  if (newSelection.length === 1) {
    const item = items.value.find(i => i.id === newSelection[0]);
    if (item) {
      editLabel.value = item.label ?? "";
      editProgress.value = Math.round((item.progress ?? 0) * 100);
      editCategory.value = item.category ?? "";
    }
  }
}

function saveEdit() {
  if (!selectedItem.value) return;
  const currentSelection = [...selectedIds.value];
  items.value = items.value.map(i => {
    const isSelected = currentSelection.includes(i.id);
    if (i.id === selectedItem.value!.id) {
      return { ...i, label: editLabel.value, progress: editProgress.value / 100, category: editCategory.value, selected: isSelected };
    }
    return { ...i, selected: isSelected };
  });
  // Re-apply selection after the dataset rebuild.
  setTimeout(() => {
    timelineRef.value?.setSelection(currentSelection);
  }, 0);
}

function deleteSelected() {
  items.value = items.value.filter(i => !selectedIds.value.includes(i.id));
  selectedIds.value = [];
}

function focusSelected() {
  if (selectedIds.value.length === 1) {
    timelineRef.value?.focus({ id: selectedIds.value[0], animate: true, duration: 400, zoom: "auto" });
  }
}

function clearSelection() {
  timelineRef.value?.clearSelection();
  selectedIds.value = [];
}

// Add item
const showAddForm = ref(false);
const newLabel = ref("New Task");
const newStart = ref("2026-02-15");
const newEnd = ref("2026-02-22");
const newGroup = ref("Sprint 3");
const newCategory = ref("dev");

function addItem() {
  const id = Math.max(0, ...items.value.map(i => Number(i.id))) + 1;
  items.value = [...items.value, {
    id,
    label: newLabel.value,
    start: newStart.value,
    end: newEnd.value || undefined,
    grouping: newGroup.value,
    category: newCategory.value,
    progress: 0,
  }];
  showAddForm.value = false;
}

function onGroupToggle(group: string, collapsed: boolean) {
  // Could track collapsed state if needed
}
</script>

<template>
  <div class="app">
    <header>
      <h1>Project Timeline</h1>
      <div class="toolbar">
        <button @click="timelineRef?.focus({ animate: true, duration: 500 })">Fit All</button>
        <button @click="showAddForm = !showAddForm">{{ showAddForm ? 'Cancel' : '+ Add Item' }}</button>
        <button v-if="selectedIds.length > 0" class="danger" @click="deleteSelected">Delete ({{ selectedIds.length }})</button>
        <button v-if="selectedIds.length > 0" @click="clearSelection">Clear Selection</button>
      </div>
    </header>

    <!-- Add item form -->
    <div v-if="showAddForm" class="add-form">
      <input v-model="newLabel" placeholder="Label" />
      <input v-model="newStart" type="date" />
      <input v-model="newEnd" type="date" />
      <select v-model="newGroup">
        <option value="Sprint 1">Sprint 1</option>
        <option value="Sprint 2">Sprint 2</option>
        <option value="Sprint 3">Sprint 3</option>
      </select>
      <select v-model="newCategory">
        <option v-for="cat in categories" :key="cat.name" :value="cat.name">{{ cat.label }}</option>
      </select>
      <button class="primary" @click="addItem">Create</button>
    </div>

    <div class="main">
      <!-- Timeline -->
      <div class="timeline-panel">
        <TempisTimeline
          ref="timelineRef"
          :items="items"
          :categories="categories"
          :dependencies="[
            { source: 1, target: 3 },
            { source: 3, target: 5 },
            { source: 5, target: 8 },
            { source: 8, target: 9 },
            { source: 9, target: 10 },
          ]"
          :options="{
            responsive: true,
            verticalFill: 'fill-canvas',
            selection: 'multi',
            range: { start: '2026-01-01', end: '2026-02-20', position: 'bottom' },
            legend: { position: 'top', markerStyle: 'circle' },
            grouping: { collapsible: true, sort: (a: string, b: string) => a.localeCompare(b) },
            style: { gridColor: '#555', font: { size: 12 } },
            minimap: { height: 30 },
            tooltip: { overflowBehavior: 'viewport' },
          }"
          :selection="selectedIds"
          width="100%"
          height="100%"
          @update:selection="onSelectionUpdate"
          @group-toggle="onGroupToggle"
        />
      </div>

      <!-- Detail panel -->
      <transition name="slide">
        <div v-if="showPanel" class="detail-panel">
          <template v-if="selectedIds.length === 1 && selectedItem">
            <h3>Edit Item</h3>
            <div class="field">
              <label>Label</label>
              <input v-model="editLabel" @change="saveEdit" />
            </div>
            <div class="field">
              <label>Category</label>
              <select v-model="editCategory" @change="saveEdit">
                <option v-for="cat in categories" :key="cat.name" :value="cat.name">{{ cat.label }}</option>
              </select>
            </div>
            <div class="field" v-if="selectedItem.end">
              <label>Progress ({{ editProgress }}%)</label>
              <input type="range" min="0" max="100" v-model.number="editProgress" @input="saveEdit" />
            </div>
            <div class="field">
              <label>Start</label>
              <div class="value">{{ new Date(selectedItem.start).toLocaleDateString() }}</div>
            </div>
            <div class="field" v-if="selectedItem.end">
              <label>End</label>
              <div class="value">{{ new Date(selectedItem.end).toLocaleDateString() }}</div>
            </div>
            <div class="field">
              <label>Group</label>
              <div class="value">{{ selectedItem.grouping }}</div>
            </div>
            <div class="actions">
              <button @click="focusSelected">Focus</button>
              <button class="danger" @click="deleteSelected">Delete</button>
            </div>
          </template>
          <template v-else>
            <h3>{{ selectedIds.length }} items selected</h3>
            <p class="muted">Select a single item to edit its properties.</p>
            <div class="actions">
              <button class="danger" @click="deleteSelected">Delete All</button>
              <button @click="clearSelection">Clear</button>
            </div>
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { height: 100%; overflow: hidden; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #111; color: #e0e0e0; }

.app { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

header { padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #2a2a2a; }
header h1 { font-size: 1.3rem; font-weight: 600; }
.toolbar { display: flex; gap: 8px; }

button { padding: 7px 14px; border: none; border-radius: 6px; background: #2a2a2a; color: #e0e0e0; cursor: pointer; font-size: 0.8rem; transition: background 0.15s; }
button:hover { background: #3a3a3a; }
button.primary { background: #6366f1; color: white; }
button.primary:hover { background: #4f46e5; }
button.danger { background: #dc2626; color: white; }
button.danger:hover { background: #b91c1c; }

.add-form { display: flex; gap: 8px; padding: 12px 24px; border-bottom: 1px solid #2a2a2a; align-items: center; flex-wrap: wrap; }
.add-form input, .add-form select { padding: 6px 10px; border: 1px solid #333; border-radius: 4px; background: #1a1a1a; color: #e0e0e0; font-size: 0.8rem; }

.main { flex: 1; display: flex; overflow: hidden; }

.timeline-panel { flex: 1; min-width: 0; }

.detail-panel { width: 280px; border-left: 1px solid #2a2a2a; padding: 20px; overflow-y: auto; background: #1a1a1a; }
.detail-panel h3 { font-size: 1rem; margin-bottom: 16px; font-weight: 600; }
.detail-panel .muted { color: #888; font-size: 0.85rem; margin-bottom: 16px; }

.field { margin-bottom: 14px; }
.field label { display: block; font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.field input, .field select { width: 100%; padding: 7px 10px; border: 1px solid #333; border-radius: 4px; background: #222; color: #e0e0e0; font-size: 0.85rem; }
.field input[type="range"] { padding: 0; background: transparent; }
.field .value { font-size: 0.85rem; color: #ccc; }

.actions { display: flex; gap: 8px; margin-top: 20px; }

.slide-enter-active, .slide-leave-active { transition: transform 0.2s ease, opacity 0.2s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(20px); opacity: 0; }
</style>
