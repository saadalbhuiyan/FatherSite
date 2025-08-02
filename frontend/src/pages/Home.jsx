import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      {/* Navigation bar */}
      <Navbar />

      {/* Centered container with max width and padding */}
      <div
        style={{
          maxWidth: 800,
          margin: 'auto',
          padding: 16,
          textAlign: 'center',
        }}
      >
        <h1>Welcome to Pan Islamic Movement website</h1>
      </div>
    </>
  );
}
