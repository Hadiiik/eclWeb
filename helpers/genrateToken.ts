export function genrateToken(email:string,studyCategory:string,area:string){
    const email_token = simpleHash(email);
    const study_category = getStudyCategory(studyCategory);
    const study_area = getArea(area);
    const token = `${email_token}?${study_area}?${study_category}`;
    return token;
}
const simpleHash = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
    }
    // تحويل القيمة إلى قاعدة 36 (رقم و حروف)
    return hash.toString(36);
};
const getStudyCategory = (studyCategory:string)=>{
    const areasArry = ['إدلب', 'سرمدا', ' الدانا', '(أريحا)جبل الزاوية', 'معرة مصرين', 'حارم', 'سلقين', 'جسر الشغور', 'عفرين', 'إعزاز', 'قطمة', 'الباب'];
    for(let i=0;i<areasArry.length;i++){
        if(studyCategory.trim()===areasArry[i].trim())
            return i.toString();
        return "unknowncategory";
    }
}
const getArea = (area:string)=>{
    const categoryArry = ['بكلوريا علمي', 'بكلوريا أدبي', 'تاسع ', 'تاسع مجالس محليه', 'بكلوريا مجالس محلية'];
    for(let i=0;i<categoryArry.length;i++)
        if(area.trim()===categoryArry[i].trim())
            return i.toString();
        return "unknowncity";
}