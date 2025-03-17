<script setup lang="ts">
const message = useMessage()
const notification = useNotification()
const dialog = useDialog()

window.$message = message
window.$notification = notification
window.$dialog = dialog
</script>

<template>
  <RouterView></RouterView>
</template>

<style lang="scss"></style>
