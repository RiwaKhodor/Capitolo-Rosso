import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';

export default function Team() {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Only show team section to admins
  if (!user || !user.isAdmin) {
    return null;
  }

  const teamMembers = [
    {
      name: t('about.team.owner.name'),
      role: t('about.team.owner.role'),
      bio: t('about.team.owner.bio'),
      image: 'https://readdy.ai/api/search-image?query=distinguished%20elegant%20french%20restaurant%20owner%20mature%20man%20in%20sophisticated%20attire%20warm%20smile%20professional%20portrait%20burgundy%20and%20cream%20background%20confident%20welcoming%20expression%20culinary%20expertise%20bordeaux%20heritage%20refined%20gentleman&width=400&height=500&seq=team-owner&orientation=portrait'
    },
    {
      name: t('about.team.chef.name'),
      role: t('about.team.chef.role'),
      bio: t('about.team.chef.bio'),
      image: 'https://readdy.ai/api/search-image?query=talented%20head%20chef%20in%20professional%20white%20chef%20uniform%20experienced%20culinary%20expert%20warm%20smile%20french%20cuisine%20specialist%20portrait%20with%20burgundy%20and%20cream%20tones%20passionate%20about%20cooking%20bordeaux%20trained%20chef%20professional%20kitchen%20background&width=400&height=500&seq=team-chef&orientation=portrait'
    },
    {
      name: t('about.team.sommelier.name'),
      role: t('about.team.sommelier.role'),
      bio: t('about.team.sommelier.bio'),
      image: 'https://readdy.ai/api/search-image?query=professional%20sommelier%20wine%20expert%20elegant%20attire%20holding%20wine%20glass%20knowledgeable%20expression%20french%20wine%20specialist%20portrait%20burgundy%20and%20cream%20background%20sophisticated%20wine%20cellar%20ambiance%20bordeaux%20wine%20expertise&width=400&height=500&seq=team-sommelier&orientation=portrait'
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#5A0A06]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-[#F5E6D3] mb-4">
            {t('about.team.title')}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#C7A454]"></div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#C7A454] to-[#B8941F] font-medium text-sm tracking-widest uppercase whitespace-nowrap">
              {t('about.team.subtitle')}
            </span>
            <div className="w-32 h-0.5 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#C7A454]"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg mb-6">
                <div className="w-full aspect-square md:h-[400px]">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#410704]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-serif text-[#F5E6D3]">
                  {member.name}
                </h3>
                <p className="text-sm text-[#C7A454] font-medium tracking-wide uppercase">
                  {member.role}
                </p>
                <p className="text-sm text-[#F5E6D3]/80 leading-relaxed pt-2">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
