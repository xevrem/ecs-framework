{
  description = "behavey nix env";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
  let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    nodePkgs = with pkgs.nodePackages; [
      eslint
      prettier
      stylelint
      typescript
      typescript-language-server
      vscode-langservers-extracted
      yaml-language-server
    ];
    in
    {
      devShells.${system}.default =
        pkgs.mkShell {
          packages = with pkgs; [
            nodejs_20
            nodePkgs
          ];

          shellHook = ''
              echo "<nix development shell>"
            '';
        };
    };
}
