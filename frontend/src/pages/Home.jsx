import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: 'auto', padding: 16, textAlign: 'center' }}>
        <h1>Welcome to Our Site</h1>
        <p>Explore our blogs, learn more about us, or get in touch via the contact page.</p>
      </div>
    </>
  );
}
