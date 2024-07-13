"use client"
const ContactSection = () => {
    return (
      <section className="py-16 bg-white " id="contact">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-700">تواصل معنا</h2>
          <form className="mt-8 max-w-md md:mx-auto mx-4">
            <div className="mb-4">
              <label className="block  mb-2 text-gray-700 text-right">بريدك الإلكتروني</label>
              <input type="email" className="w-full px-3 py-2 border rounded-lg" required  placeholder="exampel@gmail.com"/>
              <p className=" text-sm mt-2 text-slate-500 text-right">يرجى كتابة بريدك الإلكتروني بشكل صحيح حتى نتمكن من ارسال الرد اليك</p>
            </div>
            <div className="mb-4">
              <label className="block text-right mb-2 text-gray-700">العنوان</label>
              <input type="email" className="w-full px-3 py-2 border rounded-lg text-right" required />
            </div>
            <div className="mb-4">
              <label className="block text-right mb-2 text-gray-700">رسالتك</label>
              <textarea className="w-full px-3 py-2 border rounded-lg text-right" required></textarea>
            </div>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">إرسال</button>
          </form>
        </div>
      </section>
    );
  }
  
  export default ContactSection;