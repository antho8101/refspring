const supabase = supabase.createClient(
  'https://kxndsfzccqslmmwshcec.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bmRzZnpjY3FzbG1td3NoY2VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzOTU1NjQsImV4cCI6MjA2Mzk3MTU2NH0.G5_wmNPHF9b_IMADlv-v1sLNjmv5Yw0jEGDKeuDELBE'
);

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
});