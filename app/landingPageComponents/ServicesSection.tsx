const ServicesSection = () => {
    return (
      <section className="py-16 bg-gray-100" id="servises">
        <div className="container mx-auto text-center ">
          <h2 className="text-3xl font-bold text-green-700">خدماتنا</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 mx-5">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">ملفات دراسية</h3>
              <p>نوفر لك أحدث الملفات الدراسية لمساعدتك في التحصيل العلمي.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">استشارات دراسية</h3>
              <p>تواصل مع فريقنا للحصول على استشارات دراسية مخصصة.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">مستجدات تعليمية</h3>
              <p>نوافيك بآخر المستجدات في المجال التعليمي.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  export default ServicesSection;