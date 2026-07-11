// Mock API data for development when backend is not running
export const mockSettings = {
    maintenance: false,
    announcement: "",
    version: "1.0.0"
};

export const mockCourses = [
    {
        _id: '1',
        title: "Foundation of AI and Machine Learning",
        description: "Master neural networks, predictive modeling, and deep learning architectures.",
        live: true
    },
    {
        _id: '2',
        title: "Web Architecture",
        description: "Engineer high-performance full-stack applications.",
        live: false
    },
    {
        _id: '3',
        title: "IoT & Robotics",
        description: "Bridge the gap between hardware and software.",
        live: false
    },
    {
        _id: '4',
        title: "Cybersecurity Ops",
        description: "Become the shield of the digital world.",
        live: false
    }
];

export const mockUser = {
    _id: "mock-user",
    name: "Demo User",
    email: "demo@floydschool.com",
    role: "student"
};
