const copy = document.querySelector(".copy");
copy?.addEventListener("click", async () => {
  try {
    const url = `${copy.getAttribute("aria-valuetext")}`;
    await navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy link: ", err);
    alert("Failed to copy link. Please try again or copy manually.");
  }
});
