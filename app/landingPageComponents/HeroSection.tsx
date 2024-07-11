import Link from "next/link";

const HeroSection = () => {
    return (
      <section className="bg-gradient-to-r from-green-500 to-green-700 text-white py-20 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold">فريق ECL</h1>
          <p className="mt-4  ">فريقٌ يهتمُّ بنشرِ آخر مستجدّات طلاب الثَّالث الثّانويّ في الشمالِ المحرّر</p>
          <div className=" pt-16">
          <Link href={"sign-up"} className="mt-6 bg-red-600 hover:bg-red-700 py-2 px-4 rounded">تسجيل الآن</Link>
          </div>
        </div>
      </section>
    );
  }
  
  export default HeroSection;