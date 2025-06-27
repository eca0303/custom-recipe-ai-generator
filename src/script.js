let typingInstance; // global reference

function generate() {
  const cuisineSelect = document.getElementById("cuisine");
  let cuisine = cuisineSelect.value;
  const customCuisine = document.getElementById("otherCuisine").value.trim();

  if (cuisine === "Other" && customCuisine) {
    cuisine = customCuisine;
  }

  const allergies = [];
  document
    .querySelectorAll(".predefined-allergies input[type='checkbox']")
    .forEach((cb) => {
      if (cb.checked) allergies.push(cb.parentElement.textContent.trim());
    });

  document.querySelectorAll("#allergyList li").forEach((li) => {
    allergies.push(li.textContent.trim());
  });

  const textures = [];
  document.querySelectorAll("#textureList li").forEach((li) => {
    textures.push(li.textContent.trim());
  });

  const servings = document.getElementById("servings").value;

  const prompt = `Generate a recipe for ${cuisine} cuisine.
  Avoid allergens: ${allergies.join(", ") || "None"}.
  Texture: ${textures.join(", ") || "Any"}.
  Servings: ${servings}.
  Use only <br> for line breaks. End with '<strong>Created by SheCodes AI</strong>'`;

  const context =
    "You are a recipe expert AI who responds in HTML only using <br> tags. Be very mindful of allergies. Do not use any ingredients with or any products containing them.";

  const apiKey = "370ab147d13obce21d786caff668ftb9";
  const apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${encodeURIComponent(
    prompt
  )}&context=${encodeURIComponent(context)}&key=${apiKey}`;

  const result = document.getElementById("result");
  const title = document.getElementById("recipe-title");
  if (title) title.style.display = "none";

  result.innerHTML = "";

  // Start blinking "Generating..." animation
  typingInstance = new Typewriter("#result", {
    strings: ["Generating your recipe..."],
    autoStart: true,
    delay: 50,
    loop: true,
    cursor: "|",
  });

  // Fetch recipe
  axios
    .get(apiUrl)
    .then((response) => {
      typingInstance.stop(); // ✅ Stop the blinking loop
      result.innerHTML = ""; // Clear it

      new Typewriter("#result", {
        strings: response.data.answer,
        autoStart: true,
        delay: 30,
        cursor: "|",
      });
    })
    .catch((error) => {
      typingInstance.stop();
      result.innerHTML = "❌ Failed to generate recipe. Please try again.";
      console.error(error);
    });
}
