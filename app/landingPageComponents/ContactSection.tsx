"use client"

import { FormEvent, useRef, useState } from "react";

type messageData = {
  email: string,
  title: string,
  message: string
}

const ContactSection = () => {
  const [messageData, setMessageData] = useState<messageData>({ email: "", title: "", message: "" });

  const emailRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const req_body = JSON.stringify(messageData);
    const res = await fetch("/api/messages/send", { method: "POST", body: req_body });
    if (res.status !== 201) {
      alert("حدث خطأ ما اثناء ارسال الرسالة يرجى معاودة الارسال لاحقا");
    } else {
      // clear the fields 
      if (emailRef.current) emailRef.current.value = "";
      if (titleRef.current) titleRef.current.value = "";
      if (messageRef.current) messageRef.current.value = "";
      
      // Reset state
      setMessageData({ email: "", title: "", message: "" });
    }
  };

  return (
    <section className="py-16 bg-white" id="contact">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-green-700">تواصل معنا</h2>
        <form className="mt-8 max-w-md md:mx-auto mx-4" onSubmit={formSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 text-right">بريدك الإلكتروني</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg"
              required
              placeholder="exampel@gmail.com"
              ref={emailRef}
              onChange={(e) => { setMessageData({ ...messageData, email: e.target.value }) }}
            />
            <p className="text-sm mt-2 text-slate-500 text-right">يرجى كتابة بريدك الإلكتروني بشكل صحيح حتى نتمكن من ارسال الرد اليك</p>
          </div>
          <div className="mb-4">
            <label className="block text-right mb-2 text-gray-700">العنوان</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg text-right"
              required
              ref={titleRef}
              onChange={(e) => { setMessageData({ ...messageData, title: e.target.value }) }}
            />
          </div>
          <div className="mb-4">
            <label className="block text-right mb-2 text-gray-700">رسالتك</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg text-right"
              required
              ref={messageRef}
              onChange={(e) => { setMessageData({ ...messageData, message: e.target.value }) }}
            ></textarea>
          </div>
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">إرسال</button>
        </form>
      </div>
    </section>
  );
}

export default ContactSection;