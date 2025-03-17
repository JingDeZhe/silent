<script setup lang="ts">
import AppUtils from './AppUtils.vue'
</script>

<template>
  <n-message-provider>
    <n-notification-provider>
      <n-dialog-provider>
        <AppUtils></AppUtils>
      </n-dialog-provider>
    </n-notification-provider>
  </n-message-provider>
</template>

<style lang="scss"></style>
