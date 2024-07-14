export function sanitizeInput(input: string): string {
    // التحقق من وجود أحرف خاصة شائعة في SQL injection
    const sqlRegex = /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)?|INSERT( INTO)?|SELECT(.\b)?|UPDATE(.\b)?|UNION(.\b)?|HAVING(.\b)?|OR(.\b)?|\|;|--))+/gi;
    
    // التحقق من وجود أنماط JavaScript غير مرغوب فيها
    const jsRegex = /<script\b[^<](?:(?!<\/script>)<[^<])*<\/script>/gi;

    // إزالة الأحرف أو الأنماط المطابقة
    let sanitizedInput = input.replace(sqlRegex, '');
    sanitizedInput = sanitizedInput.replace(jsRegex, '');

    return sanitizedInput;
}
