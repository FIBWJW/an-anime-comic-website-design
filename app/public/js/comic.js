document.addEventListener("DOMContentLoaded", async function() {
  try {
      // 获取动漫名称
      const animeNameElement = document.querySelector(".jianjie-right h2").innerText;

      // 向后端请求获取点击量
      const response = await fetch(`/getClickCount?animeName=${encodeURIComponent(animeNameElement)}`);
      const data = await response.json();

      if (response.ok) {
          const clickCount = data.clickCount;

          // 更新 localStorage 中的点击量
          localStorage.setItem("clickCount", clickCount);

          // 更新页面上的点击量显示
          const clickCountElement = document.getElementById("click-count");
          if (clickCountElement) {
              clickCountElement.textContent = clickCount;
          } else {
              console.error('Element with id "click-count" not found.');
          }
      } else {
          console.error('Failed to fetch click count:', data.message);
      }
  } catch (error) {
      console.error('Error fetching click count:', error);
  }
});




