import React from "react";
import HomeNavbar from "../../Components/HomeNavbar";

export default function Contact() {
  return (
    <>
      <HomeNavbar />
      <section className="bg-[#eaf0fd] min-h-screen py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="space-y-6 text-blue-800">
            <h2 className="text-4xl font-extrabold">Contact Us</h2>
            <p>Need help? Reach out to our team.</p>
            <div>
              <h4 className="font-bold text-lg">La Crosse</h4>
              <p>123 Third Street, Suite 45</p>
              <p>Tel: +1 123-456-4438</p>
            </div>
          </div>

          <form className="bg-white p-8 rounded-xl shadow text-blue-900 space-y-5">
            <h3 className="text-2xl font-bold">Have a question?</h3>
            <input type="text" placeholder="Your Name" className="w-full border p-3 rounded" />
            <input type="email" placeholder="Your Email" className="w-full border p-3 rounded" />
            <textarea rows={4} placeholder="Message" className="w-full border p-3 rounded" />
            <button className="bg-blue-700 text-white font-bold px-6 py-3 rounded-full">
              SEND MESSAGE
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
