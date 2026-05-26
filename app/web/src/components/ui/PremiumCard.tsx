import './PremiumCard.css';

interface PremiumCardProps {
  title?: string;
  children: React.ReactNode;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({ title, children }) => (
  <div className="premium-card">
    {title && <h3 className="premium-card-title">{title}</h3>}
    <div className="premium-card-content">{children}</div>
  </div>
);
