const validator = require("validator");
const validation = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Enter your name.");
  } else if (
    firstName.length < 3 ||
    firstName.length > 50 ||
    lastName.length < 3 ||
    lastName.length > 50
  ) {
    throw new Error("Invalid name.");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email id");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Weak password");
  }
};
const validateEditFields = (req) => {
  const ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "skills",
    "about",
    "images",
    "existingImages",
    "age",
    "gender",
    "projects"
  ];

  const isAllowed = Object.keys(req.body).every((key) =>
    ALLOWED_FIELDS.includes(key),
  );
  // console.log(isAllowed)
  const updatedFields = Object.keys(req.body);
  console.log(updatedFields);
  if (updatedFields.includes("firstName")) {
    const firstName = req.body["firstName"];
    console.log(firstName);
    if (!firstName || firstName.length < 3 || firstName.length > 50)
      throw new Error("Invalid First Name.");
  }
  if (updatedFields.includes("lastName")) {
    const lastName = req.body["lastName"];

    if (!lastName || lastName.length < 3 || lastName.length > 50)
      throw new Error("Invalid Last Name.");
  }
  if (updatedFields.includes("images")) {
    const images = req.body["images"];

    const normalizedImages = Array.isArray(images)
      ? images
      : typeof images === "string"
        ? [images]
        : [];

    normalizedImages.forEach((image) => {
      if (
        !validator.isURL(image, {
          require_protocol: true,
          allow_query_components: true,
        })
      )
        throw new Error("Invalid photo URL.");
    });
  }

  if (updatedFields.includes("existingImages")) {
    let existingImages;
    try {
      existingImages = JSON.parse(req.body["existingImages"]);
    } catch (e) {
      throw new Error("Invalid existingImages");
    }

    if (!Array.isArray(existingImages)) {
      throw new Error("Invalid existingImages");
    }

    existingImages.forEach((image) => {
      if (
        !validator.isURL(image, {
          require_protocol: true,
          allow_query_components: true,
        })
      )
        throw new Error("Invalid photo URL.");
    });
  }

  if (updatedFields.includes("skills")) {
    let skills;
    try {
      skills =
        typeof req.body["skills"] === "string"
          ? JSON.parse(req.body["skills"])
          : req.body["skills"];
    } catch (e) {
      throw new Error("Invalid skills");
    }

    if (!Array.isArray(skills)) {
      throw new Error("Invalid skills");
    }

    if (skills.length > 10) {
      throw new Error("Too many skills");
    }

    skills.forEach((skill) => {
      if (typeof skill !== "string" || skill.trim().length === 0) {
        throw new Error("Invalid skills");
      }
    });
  }

  if (updatedFields.includes("projects")) {
    let projects;
    try {
      projects =
        typeof req.body["projects"] === "string"
          ? JSON.parse(req.body["projects"])
          : req.body["projects"];
    } catch (e) {
      throw new Error("Invalid projects");
    }

    if (!Array.isArray(projects)) {
      throw new Error("Invalid projects");
    }

    if (projects.length > 6) {
      throw new Error("Too many projects");
    }

    projects.forEach((url) => {
      if (
        typeof url !== "string" ||
        !validator.isURL(url, {
          require_protocol: true,
          allow_query_components: true,
        })
      ) {
        throw new Error("Invalid project URL.");
      }
    });
  }
  if (!isAllowed) {
    throw new Error("Not valid fields.");
  }
};

module.exports = { validation, validateEditFields };
