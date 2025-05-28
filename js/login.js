const supabase = supabase.createClient(
  'https://kxndsfzccqslmmwshcec.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bmRzZnpjY3FzbG1td3NoY2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzOTU1NjQsImV4cCI6MjA2Mzk3MTU2NH0.G5_wmNPHF9b_IMADlv-v1sLNjmv5Yw0jEGDKeuDELBE'
);

const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Tentative de connexion
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Si erreur, tenter inscription automatique
    const { data: signupData, error: signupError } = await supabase.auth.signUp({ email, password });

    if (signupError) {
      alert("Erreur d'authentification : " + signupError.message);
    } else {
      window.location.href = "dashboard.html";
    }
  } else {
    // Connexion réussie
    window.location.href = "dashboard.html";
  }
});

