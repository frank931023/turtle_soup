<script setup>

</script>

<template>
  <div class="container">
    <p class="footer-links">
      <a href="/about">關於我們</a>
      <span>|</span>
      <a href="javascript:;">使用條款</a>
      <span>|</span>
      <a href="javascript:;">聯絡我們</a>
    </p>
    <p class="copyright">© 中央大學，All rights reserved.</p>
  </div>
</template>

<style scoped lang="scss">

.container {
  padding: 30px 0 20px;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;

  p {
    margin: 10px 0;
    color: var(--footer-text-color);
    font-size: 14px;

    a {
      color: var(--footer-text-color);
      margin: 0 6px;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
