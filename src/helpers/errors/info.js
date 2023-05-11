export const generateUserErrorInfo = (user) => {
   return `
      One or more properties were incomplete or invalid.
      List of required properties:
      * firstname : needs to be a string, received "${user.firstname}"
      * lastname : needs to be a string, received "${user.lastname}"
      * email : needs to be a string, received "${user.email}"
   `
}

export const userAlreadyRegisteredErrorInfo = (user) => {
   return `
      The user with email "${user.email}" is already registered.
   `
}