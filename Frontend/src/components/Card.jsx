import logo from '../assets/logo2.png'; // Assuming your image is in the 'src/assets' directory

export const Card = () => {
    return (
        <div className="pt-25 bg-logo h-screen flex flex-col justify-center items-center">
            <div className="flex justify-center">
                <img src={logo} alt="Logo" className="object-contain max-h-80" />
            </div>
            <div className="pb-50 text-center text-xl font-semibold">
                Track, Simplify, and Share Your Expenses with Ease.
            </div>
        </div>
    );
}
