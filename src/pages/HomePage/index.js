import "./HomePages.css";
import Link from "next/link";

function HomePage() {
  return (
    <>
    <header>
        <div className="header">
            <h1>Welcome to My Website</h1>
            <p>Your one-stop solution for all your needs.</p>
        </div>
        
        <nav className="navbar">
            <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/About">About</Link></li>
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/contact">Contact</Link></li>
            </ul>
        </nav>
    </header>
    </>  
  );
}
export default HomePage;