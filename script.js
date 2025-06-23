document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("imageInput");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select an image.");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  const resultElem = document.getElementById("result");
  resultElem.textContent = "Analyzing image...";

  try {
    const res = await fetch("/analyze", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    resultElem.textContent = data.text;
  } catch (err) {
    console.error(err);
    resultElem.textContent = "Error analyzing image.";
  }
});
