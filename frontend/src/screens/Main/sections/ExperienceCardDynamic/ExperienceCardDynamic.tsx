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
            {/* Experience Image - Clean with no overlays */}
            <div 
                className="w-full h-[180px] bg-cover bg-center bg-gray-200 relative"
                style={{ 
                    backgroundImage: experience.image_url ? `url(${experience.image_url})` : 'none' 
                }}
            >
                {!experience.image_url && (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600"></div>
                )}
            </div>

            {/* Card Content - ALL content below image */}
            <CardContent className="flex flex-col p-4 bg-white">
                {/* Experience Title and Location Badge */}
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-base leading-tight flex-1">
                        {experience.name}
                    </h3>
                    <Badge className="ml-2 px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded border-0">
                        {experience.location}
                    </Badge>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    Curated small-group experience. Certified guide. Safety first with gear included.
                </p>

                {/* Price and Button Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                        <span className="text-gray-500 text-sm">From</span>
                        <span className="font-bold text-black text-lg">₹{experience.price}</span>
                    </div>

                    <Button
                        onClick={handleViewDetails}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded text-sm transition-colors border-0"
                    >
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};