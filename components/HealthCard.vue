<template>
  <div
    @click="$emit('toggle')"
    class="check-in-card"
    :class="{ 'is-done': done }"
  >
    <div class="card-inner">
      <div class="label">{{ label }}</div>
      <div class="status">
        <template v-if="done">
          <div class="status-icon">✓</div>
          <div class="status-text">已打卡</div>
        </template>
        <template v-else>
          <div class="status-icon pending">○</div>
          <div class="status-text">未完成</div>
        </template>
      </div>
    </div>
    <div class="shine"></div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  done: Boolean,
});
</script>

<style scoped lang="scss">
.check-in-card {
  margin: 0.5rem;
  position: relative;
  padding: 1.5rem;
  border-radius: 1rem;
  cursor: pointer;
  text-align: center;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    border-color: #10b981;

    .shine {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-2px);
  }

  &.is-done {
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    border-color: #10b981;

    &:hover {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    }
  }

  .card-inner {
    position: relative;
    z-index: 1;
  }

  .label {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.75rem;
    letter-spacing: -0.01em;
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: #10b981;
    color: white;
    font-weight: bold;
    font-size: 0.875rem;
    animation: checkBounce 0.5s ease;

    &.pending {
      background: #e5e7eb;
      color: #9ca3af;
      animation: none;
    }
  }

  .status-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #10b981;

    .is-done & {
      color: #059669;
    }

    .pending ~ & {
      color: #6b7280;
    }
  }

  .shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.6),
      transparent
    );
    transition: left 0.5s ease;
  }
}

@keyframes checkBounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
</style>
