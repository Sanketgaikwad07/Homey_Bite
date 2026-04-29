import React from 'react'
import './Contact.css'

export default function Contact() {
  return (
   <section className="contact-page py-5">
    <div className="container position-relative">
        <div className="row justify-content-center">
            <div className="col-lg-7 col-xl-6">
                <div className="contact-form contact-card p-5 shadow-lg">
                    <h2 className="text-center mb-2">Get in Touch</h2>
                    <p className="text-center text-muted mb-4">We would love to hear from you.</p>
                    <form>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <input type="text" className="form-control custom-input" placeholder="First Name"/>
                            </div>
                            <div className="col-md-6">
                                <input type="text" className="form-control custom-input" placeholder="Last Name"/>
                            </div>
                            <div className="col-12">
                                <input type="email" className="form-control custom-input" placeholder="Email Address"/>
                            </div>
                            <div className="col-12">
                                <textarea className="form-control custom-input" rows="5" placeholder="Your Message"></textarea>
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary w-100 py-3" type="submit">Send Message</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
  )
}
