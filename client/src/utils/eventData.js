const categories = ['All', 'Hackathon', 'AI / ML', 'Cybersecurity', 'Physics', 'Design', 'Robotics', 'Workshop'];
const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export { categories, formatDate };
