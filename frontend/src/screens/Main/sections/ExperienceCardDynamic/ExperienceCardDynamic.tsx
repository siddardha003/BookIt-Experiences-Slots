import { useNavigate } from "react-router-dom";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Experience } from "../../../../services/experiencesService";

interface ExperienceCardDynamicProps {
    experience: Experience;
}

export const ExperienceCardDynamic = ({ experience }: ExperienceCardDynamicProps): JSX.Element => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/experience/${experience.id}`);
    };

    return (
        <Card className="flex flex-col w-full rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
            {/* Experience Image */}
            <div 
                className="w-full h-[200px] bg-cover bg-center bg-gray-200 relative"
                style={{ 
                    backgroundImage: experience.image_url ? `url(${experience.image_url})` : 'none' 
                }}
            >
                {!experience.image_url && (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600"></div>
                )}
            </div>

            {/* Card Content */}
            <CardContent className="flex flex-col p-4 bg-gray-100">
                {/* Experience Title and Location Badge */}
                <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-gray-800 text-base leading-tight flex-1 text-lg">
                        {experience.name}
                    </h3>
                    <Badge className="ml-2 px-2 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-md border-0">
                        {experience.location}
                    </Badge>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Curated small-group experience. Certified guide. Safety first with gear included.
                </p>

                {/* Price and Button Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-gray-800 text-sm">From</span>
                        <span className="font-medium text-gray-800 text-xl">₹{experience.price}</span>
                    </div>

                    <Button
                        onClick={handleViewDetails}
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium px-4 py-2 rounded-lg text-sm transition-colors border-0"
                    >
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};