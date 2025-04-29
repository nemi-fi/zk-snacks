import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAccount, wallet } from "@/lib/aztec";
import { useState } from "react";

export function WalletConnect({ children }: { children: React.ReactNode }) {
  const account = useAccount();
  const [open, setOpen] = useState(false);

  if (account) {
    return children;
  }

  return (
    <>
      <WalletConnectModal open={open} onClose={() => setOpen(false)} />
      <Button onClick={() => setOpen(true)}>Connect</Button>
    </>
  );
}

export function WalletConnectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  const [isConnecting, setIsConnecting] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wallet Connect</DialogTitle>
        </DialogHeader>

        {wallet.connectors.map((connector) => (
          <Button
            key={connector.uuid}
            disabled={isConnecting}
            onClick={async () => {
              setIsConnecting(true);
              try {
                await wallet.connect(connector.uuid);
              } catch (error) {
                console.error(error);
              } finally {
                setIsConnecting(false);
              }
            }}
          >
            {isConnecting ? "Connecting..." : connector.name}
          </Button>
        ))}
      </DialogContent>
    </Dialog>
  );
}
