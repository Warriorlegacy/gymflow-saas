const url = "https://gymflow-saas.vercel.app/api/onboarding/gym";

const payload = {
  gym_name: "Peak Motion fitness",
  slug: "peak-motion-fitness",
  owner_name: "Test User",
  owner_email: "test.user" + Math.floor(Math.random() * 100000) + "@example.com",
  phone: "6202442690",
  city: "varanasi",
  state: "Uttar Pradesh",
  subscription_tier: "starter"
};

async function run() {
  console.log("Sending payload:", payload);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (e) {
    console.error("Fetch error:", e);
  }
}

run();
