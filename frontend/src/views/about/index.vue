<template>
  <div class="min-h-screen bg-black text-white p-6">
    <div class="max-w-4xl mx-auto space-y-10">
      <!-- Title Section -->
      <h1
        class="text-5xl font-extrabold text-red-600 mb-6 border-b-4 border-red-600 pb-3 shadow-xl"
      >
        血衣業：罷免與執政的對決
      </h1>

      <!-- Content Section 1 -->
      <div class="bg-gradient-to-r from-red-500 to-yellow-500 p-6 rounded-lg shadow-lg">
        <p class="mb-4 text-xl leading-relaxed text-gray-100">
          在台灣政壇，國民黨與民進黨長年角力，如今進入一個火藥味十足的階段。
          國民黨主打罷免行動，鎖定賴清德執政的破口，試圖重挾民意再起。
        </p>
      </div>

      <!-- Content Section 2 -->
      <div class="bg-gradient-to-l from-blue-500 to-indigo-700 p-6 rounded-lg shadow-lg">
        <p class="mb-4 text-xl leading-relaxed text-gray-100">
          而另一方面，民進黨則企圖穩住政權，以賴清德為核心，強調穩健執政、對抗威權陰影。
          兩黨如同古戰場中的血衣士，踏著選票與民意的波濤，展開一次又一次的意識形態之戰。
        </p>
      </div>

      <!-- Quote Section -->
      <div class="bg-gradient-to-r from-purple-600 to-pink-500 p-8 rounded-lg text-center">
        <p class="mb-4 text-2xl font-semibold text-yellow-50">
          民意是利劍，罷免是戰鼓，執政是修羅場。
        </p>
      </div>

      <!-- Footer Section -->
      <p class="mt-6 text-sm text-gray-400 italic text-right">
        —— 記於2025年的春末，霧氣未散，政局已赤。
      </p>
    </div>
  </div>
</template>

<script setup>
// 無需額外邏輯
</script>

<style scoped>
/* Custom Styles */
.shadow-xl {
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08);
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-l {
  background-image: linear-gradient(to left, var(--tw-gradient-stops));
}

.text-yellow-50 {
  color: #fefcbf;
}

.text-gray-100 {
  color: #f5f5f5;
}
</style>
