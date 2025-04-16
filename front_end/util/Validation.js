export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

export const validateMobile = (mobile) => {
    const sriLankanMobileRegex = /^(?:\+94|0)?7[0-9]{8}$/;
    return sriLankanMobileRegex.test(mobile);
}

export const validateRouteNumber = (number) => {
    const routeNumberRegex = /^\d{1,3}$/;
    return routeNumberRegex.test(number);
}

export const validateText = (text) => {
    const Regex = /^[a-zA-Z]+$/;
    return Regex.test(text);
}

export const from30To200Regex = (number) => {
    const Regex = /^(?:[3-9][0-9]|1[0-4][0-9]|150)$/;
    return Regex.test(number);
}

export const busNumberPlateRegex = (text) => {
    const Regex = /^[A-Z]{2,3}-\d{4}$/;
    return Regex.test(text);
}

export const strongPasswordRegex = (password) => {
    const Regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;
    return Regex.test(password);
}

export const usernameRegex  = (username) => {
    const Regex = /^[a-zA-Z0-9_.-]{3,30}$/;
    return Regex.test(username);
}

export const strictFullNameRegex   = (Name) => {
    const Regex =  /^[A-Za-zÀ-ÖØ-öø-ÿ ]{2,50}$/;
    return Regex.test(Name);
}